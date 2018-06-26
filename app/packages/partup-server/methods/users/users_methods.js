import _ from 'lodash'

const { impersonation } = Partup.helpers;

Meteor.methods({
    /**
     * Update a user
     *
     * @param {mixed[]} fields
     */
    'users.update': function(fields) {
        check(fields, Partup.schemas.forms.profileSettings);

        var upper = Meteor.user();

        if (!upper) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            var userFields = Partup.transformers.profile.fromFormProfileSettings(fields);
            userFields.profile.normalized_name = Partup.helpers.normalize(userFields.profile.name);

            // Merge the old profile so empty fields do not get overwritten
            var mergedProfile = _.extend(upper.profile, userFields.profile);

            Meteor.users.update(upper._id, {$set: {profile: mergedProfile}});
            Event.emit('users.updated', upper._id, userFields);

            return {
                _id: upper._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'user_could_not_be_updated');
        }
    },

    /**
     * Return a list of users in a specific partup based on search query
     *
     * @param {string} searchString
     * @param {string} group
     * @param {string} partupId
     * @param {object} options
     */
    'users.autocomplete': function(searchString, group, partupId, options) {
        options = options || {};

        check(searchString, String);
        if (group) check(group, String);
        if (partupId) check(partupId, String);
        if (options.chatSearch) check(options.chatSearch, Boolean);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');

        try {
            // Remove accents that might have been added to the query
            searchString = mout.string.replaceAccents(searchString.toLowerCase());
            var selector = {'profile.normalized_name': new RegExp('.*' + searchString + '.*', 'i')};
            if (options.chatSearch) selector._id = {$ne: user._id};
            var suggestions = Meteor.users.findActiveUsers(selector, {limit: 30}).fetch();
            switch (group) {
                case 'partners':
                    var partners = Meteor.users.findActiveUsers({upperOf: {$in: [partupId]}}).fetch();
                    suggestions.unshift({
                        type: 'partners',
                        name: 'Partners',
                        users: partners
                    });

                    break;
                case 'supporters':
                    var supporters = Meteor.users.findActiveUsers({supporterOf: {$in: [partupId]}}).fetch();
                    suggestions.unshift({
                        type: 'supporters',
                        name: 'Supporters',
                        users: supporters
                    });
                    break;
            }

            return suggestions.map(function(user) {
                if (options.chatSearch) {
                    user.embeddedImage = Images.findForUser(user).fetch().pop();
                }

                return user;
            });
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'users_could_not_be_autocompleted');
        }
    },

    /**
     * Return a list of users based on search query
     *
     * @param {string} searchString
     */
    'users.upper_autocomplete': function(searchString) {
        check(searchString, String);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');

        try {
            // Remove accents that might have been added to the query
            searchString = mout.string.replaceAccents(searchString.toLowerCase());
            return Meteor.users.findActiveUsers({'profile.normalized_name': new RegExp('.*' + searchString + '.*', 'i')}, {limit: 30}).fetch();
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'users_could_not_be_autocompleted');
        }
    },

    /**
     * Deactivate user
     *
     * @param  {string} userId
     */
    'users.deactivate': function(userId) {
        check(userId, String);

        var user = Meteor.user();
        if (!User(user).isAdmin()) {
            return;
        }

        var subject = Meteor.users.findOne(userId);
        if (!subject) throw new Meteor.Error(401, 'unauthorized');
        if (!User(subject).isActive()) throw new Meteor.Error(400, 'user_is_inactive');

        try {
            Meteor.users.update(subject._id, {$set: {
                deactivatedAt: new Date()
            }});

            Event.emit('users.deactivated', subject._id);

            return {
                _id: subject._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(500, 'user_could_not_be_deactivated');
        }
    },

    /**
     * Reactivate user
     *
     * @param  {string} userId
     */
    'users.reactivate': function(userId) {
        check(userId, String);

        var user = Meteor.user();
        if (!User(user).isAdmin()) {
            return;
        }

        var subject = Meteor.users.findOne(userId);
        if (!subject) throw new Meteor.Error(401, 'unauthorized');
        if (User(subject).isActive()) throw new Meteor.Error(400, 'user_is_active');

        try {
            Meteor.users.update(subject._id, {$unset: {
                deactivatedAt: ''
            }});

            Event.emit('users.reactivated', subject._id);

            return {
                _id: subject._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(500, 'user_could_not_be_reactivated');
        }
    },

    /**
    * Returns user data to superadmins only
    */
    'users.admin_all': function(selector, options) {
        var user = Meteor.users.findOne(this.userId);
        if (!User(user).isAdmin()) {
            return;
        }
        var selector = selector || {};
        var option = options || {};
        return Meteor.users.findForAdminList(selector, options).fetch();
    },

    /**
    * Returns user stats to superadmins only
    */
    'users.admin_stats': function() {
        var user = Meteor.users.findOne(this.userId);
        if (!User(user).isAdmin()) {
            return;
        }
        return Meteor.users.findStatsForAdmin();
    },

    'users.admin_get_accepted_impersonation_requests'() {
      const admin = Meteor.users.findOne(this.userId);

      if (User(admin).isAdmin()) {
        return ImpersonationRequests.findAcceptedRequests();
      }

      return undefined;
    },

    'users.admin_request_impersonation'(userId) {
      const admin = Meteor.users.findOne(this.userId);

      if (User(admin).isAdmin()) {
        const impersonateUser = Meteor.users.findOne(userId);

        if (impersonateUser) {
          const existingImpersonationRequest = ImpersonationRequests.findOneActiveRequest(impersonateUser._id, impersonation.IMPERSONATION_REQUEST_STATUS.PENDING);
          if (existingImpersonationRequest) {
            throw new Meteor.Error(0, `admin-error-impersonation-request-existing-request`, 'The user already has a pending impersonation request, please both refresh the page.');
          }

          if (impersonateUser) {
            ImpersonationRequests.insert({
              adminId: admin._id,
              userId: impersonateUser._id,
              status: impersonation.IMPERSONATION_REQUEST_STATUS.PENDING,
            });
            return 1;
          }
        }
      }
      return -1;
    },

    /**
    * Returns user stats to superadmins only
    */
    'users.admin_impersonate': function(userId) {
        check(userId, String);

        const currentUser = Meteor.users.findOne(this.userId);

        if (User(currentUser).isAdmin()) {
          const impersonateUser = Meteor.users.findOne(userId);

          if (impersonateUser) {
            const request = ImpersonationRequests.findOneActiveRequest(impersonateUser._id, impersonation.IMPERSONATION_REQUEST_STATUS.ACCEPTED);

            if (request) {
              const timeLeft = impersonation.timeLeft(request);

              if (timeLeft > 0) {
                Meteor.setTimeout(() => {
                  this.setUserId(currentUser._id);
                }, timeLeft);

                this.setUserId(impersonateUser._id);
              }
              return timeLeft;
            } else {
              throw new Meteor.Error(0, 'impersonation_not_activated');
            }
          } else {
            throw new Meteor.Error(404, 'user_could_not_be_found');
          }
        }
    },

    'users.allow_impersonation'() {
      const impersonationRequest = ImpersonationRequests.findOneActiveRequest(this.userId);

      if (!impersonationRequest) {
        return -1;
      }
      if (impersonation.isActive(impersonationRequest)) {
        throw new Meteor.Error(0, 'impersonation-still-active', 'The last ImpersonationRequest is still active');
      }

      const changes =  {
        status: impersonation.IMPERSONATION_REQUEST_STATUS.ACCEPTED,
        accepted_at: new Date(),
      };

      ImpersonationRequests.update(impersonationRequest._id, { $set: changes });
      return Object.assign(impersonationRequest, changes);
    },

    'users.get_non_expired_impersonation_request'() {
      return ImpersonationRequests.findOneActiveRequest(this.userId);
    },

    /**
     * Returns the user's locale based on IP lookup
     */
    'users.get_locale': function() {
        this.unblock();

        // NOTE: disabled getlocale service to try and fix perf issues
        // var ipAddress = this.connection.clientAddress;
        // return Partup.server.services.locale.get_locale(ipAddress);

        return 'nl';
    },

    /**
     * Returns the users membership of the provided network
     */
    'users.member_of_network': function(userId, networkSlug) {
        var network = Networks.findOne({slug: networkSlug});
        var response = network ? {
            has_member: network.hasMember(userId)
        } : false;
        return response;
    },

    /**
     * Register a device for push notifications
     */
    'users.register_pushnotifications_device': function(registrationId, device, loginToken, appVersion) {
        check(this.userId, String);
        check(registrationId, String);
        check(device.uuid, String);
        check(device.manufacturer, String);
        check(device.model, String);
        check(device.version, String);
        check(device.platform, String);
        check(loginToken, Match.Optional(String));
        check(appVersion, Match.Optional(String));

        if (loginToken) {
            var hashedLoginToken = Accounts._hashLoginToken(loginToken);
            var loginTokenValid = !!Meteor.users.findOne({
                '_id': this.userId,
                'services.resume.loginTokens.hashedToken': hashedLoginToken
            });
            if (!loginTokenValid) {
                throw 'loginToken is expired';
            }
        }

        // Remove old push notification device by uuid
        Meteor.users.update({
            _id: this.userId
        }, {
            $pull: {
                'push_notification_devices': {
                    uuid: device.uuid
                }
            }
        });

        // Insert new push notification device
        Meteor.users.update(this.userId, {
            $addToSet: {
                'push_notification_devices': {
                    registration_id: registrationId,
                    uuid: device.uuid,
                    manufacturer: device.manufacturer,
                    model: device.model,
                    platform: device.platform,
                    version: device.version,
                    loginToken: loginToken && hashedLoginToken || null,
                    createdAt: new Date(),
                    appVersion: appVersion || 'unknown'
                }
            }
        });
    },

    /**
     * Start a chat with the provided users
     */
    'users.start_chat': function(userIds) {
        check(userIds, [String]);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');
        userIds.unshift(user._id);

        try {
            var chatId = Meteor.call('chats.insert', fields);
            Chats.update(chatId, {$set: {creator_id: user._id}});
            Meteor.users.update({_id: {$in: userIds}}, {$addToSet: {chats: chatId}});

            return chatId;
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'network_chat_could_not_be_inserted');
        }
    },

    /**
     * Order set of parners by occurrence
     * @param userId
     * @param partners
     */
    'users.order_partners': function(userId, partners) {
        check(userId, String);
        check(partners, [Object]);

        var upper = Meteor.users.findOne(userId);
        var upperPartups = upper.upperOf || [];

        partners.forEach(function(partner) {
           partner.partner_count = lodash.intersection(upperPartups, partner.upperOf).length;
        });

        return lodash.sortByOrder(partners, ['partner_count', 'participation_score'], ['desc', 'desc']);
    },

    /**
     * Order network uppers tab by admins first, then colleagues (in group order based on upper score) and then on upper score
     * @param networkSlug
     * @param uppers
     */
    'users.order_network_uppers': function(networkSlug, uppers) {
        check(networkSlug, String);
        check(uppers, [Object]);

        var network = Networks.findOneOrFail({slug: networkSlug});

        uppers.forEach(function(upper) {
            upper.admin = (network.admins && network.admins.indexOf(upper._id) > -1) ? upper.participation_score : -1;
            upper.colleague = (network.colleagues && network.colleagues.indexOf(upper._id) > -1) ? upper.participation_score : -1;
        });

        return lodash.sortByOrder(uppers, ['admin', 'colleague', 'participation_score'], ['desc', 'desc', 'desc']);
    },

    /**
     * Add an email address to a user that he/she can login with. This also sends the verification email.
     * @param emailAddress
     */
    'users.add_email': function(emailAddress) {
        check(emailAddress, String);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');

        // Check if mailaddress is already in use
        var addressExisits = Meteor.users.findOne({$or: [
            {'emails.address': emailAddress},
            {'registered_emails.address': emailAddress},
            {'services.email.verificationTokens.address': emailAddress}
        ]});

        if (addressExisits) throw new Meteor.Error(400, 'email_address_already_in_use');

        // Add email to user's email list
        Meteor.users.update(user._id, {$addToSet: {emails: {address: emailAddress, verified: false}}});

        Accounts.sendVerificationEmail(user._id, emailAddress);
    },

    /**
     * Remove a given email address by index
     * @param emailIndex
     */
    'users.remove_email': function(emailIndex) {
        check(emailIndex, Number);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');

        if (user.emails.length < 2 || emailIndex == 0) {
            throw new Meteor.Error(400, 'primary_email_cannot_be_removed');
        }

        if (emailIndex > 0 && emailIndex < user.emails.length) {
            user.emails.splice(emailIndex, 1);
            Meteor.users.update(user._id, {$set: {emails: user.emails}});
        }
    },

    /**
     * Set a given email address as primary address
     * @param emailIndex
     */
    'users.set_primary_email': function(emailIndex) {
        check(emailIndex, Number);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');

        if (emailIndex > 0 && emailIndex < user.emails.length) {
            var primary = lodash.pullAt(user.emails, emailIndex);
            console.log(primary);
            user.emails.unshift(primary[0]);
            Meteor.users.update(user._id, {$set: {emails: user.emails}});
        }
    },

    'users.delete': function() {

        var user = Meteor.user();

        if (!user) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {

            // Remove all partnerships & and become a supporter
            _.get(user, 'upperOf', []).forEach((partupId) => {
                partup = Partups.findOne({_id: partupId})
                
                // If the user is the only partner, archive first
                if (_.isEqual(partup.uppers, [user._id])) {
                    Meteor.call('partups.archive', partupId)
                }

                Meteor.call('partups.unpartner', partupId, function (err, res) {
                    Meteor.call('partups.supporters.remove', partupId)
                })
            })


            // Remove the user as a creator from partups
            const createdPartups = Partups.find({"creator_id": user._id}).fetch()
            createdPartups.forEach((partup) => {
            	// Remove the user as a creator by setting the creator ID to the next partner
            	if (partup.uppers) {
            		Partups.update(partup._id, { $set: { 'creator_id': partup.uppers[0] }});	
            	}
            })	

            // Remove supporter from partup
            _.get(user, 'supporterOf', []).forEach((partupId) => {
                Meteor.call('partups.supporters.remove', partupId)
            })

            // Remove from tribes
            _.get(user, 'networks', []).forEach((networkId) => {
                network = Networks.findOne({_id: networkId})
                // If the user is the only member, archive first
                if (_.isEqual(_.get(network, 'uppers', []), [user.id])) {
                    try {
                        Meteor.call('networks.make_admin', 'EBnHxX2WYy6LicBPg')

                        Meteor.call('networks.remove_upper', network.slug, user._id)
                    } catch (e) {
                        Meteor.call('networks.archive', network.slug)
                    }
                } else {
                    if (network.isAdmin(user._id)) {
                        Meteor.call('networks.remove_upper', network.slug, user._id)
                    } else {
                        Meteor.call('networks.leave', networkId)
                    }
                }
            })



            // Delete images
            const imagesForDeletion = []

            // Profile images
            const profileImage = _.get(user, 'profile.image')
            if (profileImage) {
                imagesForDeletion.push(profileImage)
            }

            // Find any tiles associated with a user and delete them
            // But keep a record for images that need to deleted
            Tiles.find({upper_id: user.id}).forEach((tile) => {
                if (tile.image_id) {
                    imagesForDeletion.push(tile.image_id)
                }
                Meteor.call('tiles.remove', tile._id)
            })

            // Empty out the profile
            fieldsForDeletion = {
                'image': 'system', // Sets the profile image to system
                'description': "",
                'tags': [],
                'facebook_url': "",
                'twitter_url': "",
                'instagram_url': "",
                'linkedin_url': "",
                'phonenumber': "",
                'website': "",
                'skype': "",
                'name': "Deleted User"
            }
            var userDeletedFields = Partup.transformers.profile.fromFormProfileSettings(fieldsForDeletion);

            // Merge the old profile so empty fields do not get overwritten
            Meteor.users.update(user._id, {$set: {
                profile: userDeletedFields.profile,
                emails: [],
                registered_emails: [],
                services: {},
                logins: [],
                flags: []
            }});

            Meteor.users.update(user._id, {$set: {
                deletedAt: new Date()
            }});

            // Delete notifications
            Notifications.deleteForCreator(user)

            if (imagesForDeletion.length > 0) {
                Meteor.call('images.remove_many', imagesForDeletion)
            }

            Event.emit('users.deleted', user._id);

            return {
                _id: user._id
            }
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(500, 'user_could_not_be_deleted');
        }
    },

    'users.one'(userId) {
      check(userId, String);
      return Meteor.users.findSinglePublicProfile(userId).fetch().pop();
    },

    'users.createIntercomHash'(userId) {
      check(userId, String);

      const intercomSecret = Meteor.isDevelopment ?
        _.get(JSON.parse(process.env.METEOR_SETTINGS), 'intercom.secret') :
        _.get(Meteor, 'settings.intercom.secret');

      if (intercomSecret) {
        return Npm.require('crypto').createHmac('sha256', new Buffer(intercomSecret, 'utf8')).update(userId).digest('hex');
      }
    },

});
