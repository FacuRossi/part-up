/**
 * Testing Migrations locally
 *
 * Make sure the fixture data is set-up the way it should be before the migrations ran.
 * The migrations will run before the database is populated with the fixture data so,
 * start meteor shell via the terminal 'cd app && meteor shell'
 * type 'Migrations.migrateTo('<version>,rerun')' to re-run the migration.
 * Check your local database for the results meteor exposes it on localhost:3001
 * You can use robomongo to access and test it.
 *
 */

Migrations.config({
    logger: LogFunc
});

Migrations.add({
    version: 1,
    name: 'Copy all inserted user and partup tags to Tags collection.',
    up: function () {
        var tags = [];

        // Collect all tags from user profiles
        Meteor.users.find().fetch().forEach(function (user) {
            if (user.tags !== undefined) {
                user.tags.forEach(function (tag) {
                    tags.push(tag.toLocaleLowerCase());
                });
            }
        });

        // Collect all tags from partups
        Partups.find().fetch().forEach(function (partup) {
            if (partup.tags !== undefined) {
                partup.tags.forEach(function (tag) {
                    tags.push(tag.toLocaleLowerCase());
                });
            }
        });

        // Remove duplicates
        var uniqueTags = tags.filter(function (elem, pos) {
            return tags.indexOf(elem) == pos;
        });

        // Now insert all collected tags into the database
        uniqueTags.forEach(function (tag) {
            var trimmedTag = tag.trim(); // Some tags had leading or trailing spaces
            if (!Tags.findOne({ _id: trimmedTag })) {
                Tags.insert({ _id: trimmedTag });
            }
        });

        Log.debug(uniqueTags.length + ' tags inserted in Tags collection.');
    },
    down: function () {
        // Code to migrate to previous version
    }
});

Migrations.add({
    version: 2,
    name: 'Save old images to new image stores',
    up: function () {
        console.log('Save old images to new image stores');
        Images.find().fetch().forEach(function (image) {
            if (image.copies['32x32'].size === 0) {
                console.log('creating 32x32 image: ' + image.name());
                var readStream = image.createReadStream('original');
                var writeStream = image.createWriteStream('32x32');
                gm(readStream, image.name()).resize(32, 32).stream().pipe(writeStream);
            }
            if (image.copies['80x80'].size === 0) {
                console.log('creating 80x80 image: ' + image.name());
                var readStream = image.createReadStream('original');
                var writeStream = image.createWriteStream('80x80');
                gm(readStream, image.name()).resize(80, 80).stream().pipe(writeStream);
            }
        });
    },
    down: function () { }
});

Migrations.add({
    version: 3,
    name: 'Add a slug to the existing Partups',
    up: function () {
        var partups = Partups.find({ slug: { $exists: false } });

        partups.forEach(function (partup) {
            var slug = Partup.server.services.slugify.slugifyDocument(partup, 'name');
            Partups.update({ _id: partup._id }, { $set: { slug: slug } });
        });
    },
    down: function () {
        Partups.update({ slug: { $exists: true } }, { $unset: { slug: '' } }, { multi: true });
    }
});

Migrations.add({
    version: 4,
    name: 'Add a slug to the existing Networks',
    up: function () {
        var networks = Networks.find({ slug: { $exists: false } });

        networks.forEach(function (network) {
            var slug = Partup.server.services.slugify.slugify(network.name);
            Networks.update({ _id: network._id }, { $set: { slug: slug } });
        });
    },
    down: function () {
        Networks.update({ slug: { $exists: true } }, { $unset: { slug: '' } }, { multi: true });
    }
});

Migrations.add({
    version: 5,
    name: 'Rename the user.profile.<social> fields to user.profile.<social>_url and prefix their values with i.e. https://facebook.com/. Also delete all linkedin_id fields.',
    up: function () {
        Meteor.users.find().forEach(function (user) {
            if (!user || !user.profile) return;

            if (user.profile.facebook) {
                user.profile.facebook_url = 'https://facebook.com/' + user.profile.facebook;
            }

            if (user.profile.instagram) {
                user.profile.instagram_url = 'https://instagram.com/' + user.profile.instagram;
            }

            if (user.profile.twitter) {
                user.profile.twitter_url = 'https://twitter.com/' + user.profile.twitter;
            }

            if (user.profile.linkedin) {
                user.profile.linkedin_url = 'https://linkedin.com/in/' + user.profile.linkedin;
            }

            if (user.profile.linkedin_id) {
                delete user.profile.linkedin_id;
            }

            Meteor.users.update({ _id: user._id }, { $set: { 'profile': user.profile } });
        });
    },
    down: function () {
        Meteor.users.find().forEach(function (user) {
            if (!user || !user.profile) return;

            if (user.profile.facebook_url) {
                delete user.profile.facebook_url;
            }

            if (user.profile.instagram_url) {
                delete user.profile.instagram_url;
            }

            if (user.profile.twitter_url) {
                delete user.profile.twitter_url;
            }

            if (user.profile.linkedin_url) {
                delete user.profile.linkedin_url;
            }

            Meteor.users.update({ _id: user._id }, { $set: { 'profile': user.profile } });
        });
    }
});

Migrations.add({
    version: 6,
    name: 'Calculate the Part-up participation score for users',
    up: function () {
        // TODO: Smarter way to do this, most likely not everyone
        // needs a Part-up participation score calculation
        Meteor.users.find({ participation_score: { $exists: false } }).forEach(function (user) {
            var score = Partup.server.services.participation_calculator.calculateParticipationScoreForUpper(user._id);
            Meteor.users.update(user._id, { $set: { participation_score: score } });
        });
    },
    down: function () {
        Meteor.users.update({ participation_score: { $exists: true } }, { $unset: { participation_score: '' } }, { multi: true });
    }
});

Migrations.add({
    version: 7,
    name: 'Calculate the Part-up progress score for partups',
    up: function () {
        // TODO: Smarter way to do this, most likely not all
        // partups need a progress score calculation
        Partups.find({ progress: { $exists: false } }).forEach(function (partup) {
            var score = Partup.server.services.partup_progress_calculator.calculatePartupProgressScore(partup._id);
            Partups.update(partup._id, { '$set': { progress: score } });
        });
    },
    down: function () {
        Partups.update({ progress: { $exists: true } }, { $unset: { progress: '' } }, { multi: true });
    }
});

Migrations.add({
    version: 8,
    name: 'Remove all notifications because they are incompatible at this point',
    up: function () {
        Notifications.remove({});
    },
    down: function () {
        // Nothing to do
    }
});

Migrations.add({
    version: 9,
    name: 'Remove duplicate IDs in user/partup/network arrays',
    up: function () {
        // Define the names of the user properties that contain arrays
        var arrayLists = ['supporterOf', 'upperOf', 'networks', 'pending_networks'];
        // Now go through all users and remove duplicate entries
        Meteor.users.find().fetch().forEach(function (user) {
            arrayLists.forEach(function (arrayList) {
                if (user[arrayList]) {
                    var uniqueValues = lodash.unique(user[arrayList]);
                    var setModifier = { $set: {} };
                    setModifier.$set[arrayList] = uniqueValues;
                    Meteor.users.update({ _id: user._id }, setModifier);
                }
            });
        });

        // Repeat the above steps for partups and networks
        arrayLists = ['supporters', 'uppers', 'invites'];
        Partups.find().fetch().forEach(function (partup) {
            arrayLists.forEach(function (arrayList) {
                if (partup[arrayList]) {
                    var uniqueValues = lodash.unique(partup[arrayList]);
                    var setModifier = { $set: {} };
                    setModifier.$set[arrayList] = uniqueValues;
                    Partups.update({ _id: partup._id }, setModifier);
                }
            });
        });

        arrayLists = ['uppers', 'pending_uppers'];
        Networks.find().fetch().forEach(function (network) {
            arrayLists.forEach(function (arrayList) {
                if (network[arrayList]) {
                    var uniqueValues = lodash.unique(network[arrayList]);
                    var setModifier = { $set: {} };
                    setModifier.$set[arrayList] = uniqueValues;
                    Networks.update({ _id: network._id }, setModifier);
                }
            });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 10,
    name: 'Add flags and email settings to existing users',
    up: function () {
        Meteor.users.update({}, {
            '$set': {
                'flags.dailyDigestEmailHasBeenSent': false,
                'profile.settings.email.dailydigest': true
            }
        }, { multi: true });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 11,
    name: 'Set language on all current partups and networks',
    up: function () {
        Partups.find().fetch().forEach(function (partup) {
            if (!partup.language) {
                var language = Partup.server.services.google.detectLanguage(partup.description);
                Log.debug('Setting language *' + language + '* for Partup "' + partup.name + '"');
                Partups.update({ _id: partup._id }, { $set: { language: language } });
            }
        });
        Networks.find().fetch().forEach(function (network) {
            if (!network.language) {
                var language = Partup.server.services.google.detectLanguage(network.description);
                Log.debug('Setting language *' + language + '* for Network "' + network.name + '"');
                Networks.update({ _id: network._id }, { $set: { language: language } });
            }
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 12,
    name: 'Set unsubscribe email token for all users',
    up: function () {
        Meteor.users.find().forEach(function (user) {
            var token = Random.secret();
            Meteor.users.update(user._id, { $set: { 'profile.settings.unsubscribe_email_token': token } });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 13,
    name: 'Set default email notification setting',
    up: function () {
        Meteor.users.find().forEach(function (user) {
            Meteor.users.update(user._id, {
                $set: {
                    'profile.settings.email.upper_mentioned_in_partup': true,
                    'profile.settings.email.invite_upper_to_partup_activity': true,
                    'profile.settings.email.invite_upper_to_network': true,
                    'profile.settings.email.partup_created_in_network': true
                }
            });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 14,
    name: 'Download profile pictures for facebook and linkedin users',
    up: function () {
        var setRandomUserImage = function (user) {
            var images = Images.find({ 'meta.default_profile_picture': true }).fetch();
            image = mout.random.choice(images);
            Meteor.users.update(user._id, { $set: { 'profile.image': image._id } });
        };

        var downloadAndSetUserImage = function (user, imageUrl) {
            if (!imageUrl) return setRandomUserImage(user);

            try {
                var result = HTTP.get(imageUrl, { 'npmRequestOptions': { 'encoding': null } });
                var body = new Buffer(result.content, 'binary');

                var image = Partup.server.services.images.upload(user._id + '.jpg', body, 'image/jpeg');

                return Meteor.users.update(user._id, { $set: { 'profile.image': image._id } });
            } catch (error) {
                console.log(error);
                setRandomUserImage(user);
            }
        };

        // Username + password users
        Meteor.users.find({ 'services.password': { $exists: true } }).forEach(function (user) {
            setRandomUserImage(user);
        });

        // Facebook users
        Meteor.users.find({ 'services.facebook': { $exists: true } }).forEach(function (user) {
            var url = 'https://graph.facebook.com/' + user.services.facebook.id + '/picture?width=750';
            downloadAndSetUserImage(user, url);
        });

        // LinkedIn users
        Meteor.users.find({ 'services.linkedin': { $exists: true } }).forEach(function (user) {
            var url = user.services.linkedin.pictureUrl;
            downloadAndSetUserImage(user, url);
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 15,
    name: 'Set default partup picture on all partups',
    up: function () {
        Partups.find({}).forEach(function (partup) {
            var images = Images.find({ 'meta.default_partup_picture': true }).fetch();
            image = mout.random.choice(images);
            Partups.update(partup._id, { $set: { 'image': image._id } });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 16,
    name: 'Re-added migration 11 for language errors, and update the indices',
    up: function () {
        // Fix the indices
        Partups._dropIndex('name_text_description_text');
        Partups._ensureIndex({ 'name': 'text', 'description': 'text' }, { language_override: 'idioma' });

        Partups.find().fetch().forEach(function (partup) {
            if (!partup.language) {
                var language = Partup.server.services.google.detectLanguage(partup.description);
                Log.debug('Setting language *' + language + '* for Partup "' + partup.name + '"');
                Partups.update({ _id: partup._id }, { $set: { language: language } });
            }
        });
        Networks.find().fetch().forEach(function (network) {
            if (!network.language) {
                var language = Partup.server.services.google.detectLanguage(network.description);
                Log.debug('Setting language *' + language + '* for Network "' + network.name + '"');
                Networks.update({ _id: network._id }, { $set: { language: language } });
            }
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 17,
    name: 'Set new email notification setting',
    up: function () {
        Meteor.users.find().forEach(function (user) {
            Meteor.users.update(user._id, {
                $set: {
                    'profile.settings.email.partups_networks_new_pending_upper': true,
                    'profile.settings.email.partups_networks_accepted': true
                }
            });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 18,
    name: 'Update hard-coded images in notifications',
    up: function () {
        Notifications.find().forEach(function (notification) {
            var set = {};

            if (!notification.type_data) return;

            // Creator
            if (notification.type_data.creator) {
                var creator = Meteor.users.findOne({ _id: notification.type_data.creator._id });
                if (creator) {
                    set['type_data.creator.image'] = creator.profile.image;
                }
            }

            // Inviter
            if (notification.type_data.inviter) {
                var inviter = Meteor.users.findOne({ _id: notification.type_data.inviter._id });
                if (inviter) {
                    set['type_data.inviter.image'] = inviter.profile.image;
                }
            }

            // Accepter
            if (notification.type_data.accepter) {
                var accepter = Meteor.users.findOne({ _id: notification.type_data.accepter._id });
                if (accepter) {
                    set['type_data.accepter.image'] = accepter.profile.image;
                }
            }

            // Rejecter
            if (notification.type_data.rejecter) {
                var rejecter = Meteor.users.findOne({ _id: notification.type_data.rejecter._id });
                if (rejecter) {
                    set['type_data.rejecter.image'] = rejecter.profile.image;
                }
            }

            // Supporter
            if (notification.type_data.supporter) {
                var supporter = Meteor.users.findOne({ _id: notification.type_data.supporter._id });
                if (supporter) {
                    set['type_data.supporter.image'] = supporter.profile.image;
                }
            }

            // Pending upper
            if (notification.type_data.pending_upper) {
                var pending_upper = Meteor.users.findOne({ _id: notification.type_data.pending_upper._id });
                if (pending_upper) {
                    set['type_data.pending_upper.image'] = pending_upper.profile.image;
                }
            }

            // Rater
            if (notification.type_data.rater) {
                var rater = Meteor.users.findOne({ _id: notification.type_data.rater._id });
                if (rater) {
                    set['type_data.rater.image'] = rater.profile.image;
                }
            }

            // Commenter
            if (notification.type_data.commenter) {
                var commenter = Meteor.users.findOne({ _id: notification.type_data.commenter._id });
                if (commenter) {
                    set['type_data.commenter.image'] = commenter.profile.image;
                }
            }

            // Mentioning upper
            if (notification.type_data.mentioning_upper) {
                var mentioning_upper = Meteor.users.findOne({ _id: notification.type_data.mentioning_upper._id });
                if (mentioning_upper) {
                    set['type_data.mentioning_upper.image'] = mentioning_upper.profile.image;
                }
            }

            // Partup
            if (notification.type_data.partup) {
                var partup = Partups.findOne({ _id: notification.type_data.partup._id });
                if (partup) {
                    set['type_data.partup.image'] = partup.image;
                }
            }

            // Network
            if (notification.type_data.network) {
                var network = Networks.findOne({ _id: notification.type_data.network._id });
                if (network) {
                    set['type_data.network.image'] = network.image;
                }
            }

            if (Object.keys(set).length > 0) {
                Notifications.update(notification._id, { $set: set });
            }

        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 19,
    name: 'Set a normalized name for each user to also show accented names in search query',
    up: function () {
        Meteor.users.find().forEach(function (user) {
            Meteor.users.update(user._id, {
                $set: {
                    'profile.normalized_name': Partup.helpers.normalize(user.profile.name)
                }
            });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 20,
    name: 'Make an upper_data object for all partners/supporters of a partup',
    up: function () {
        Partups.find({}).forEach(function (partup) {
            partup.getUsers().forEach(function (upperId) {
                // Set data object for new partners/supporters
                partup.createUpperDataObject(upperId);
            });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 21,
    name: 'Convert old partup budget types to new ones',
    up: function () {
        Partups.find({}).forEach(function (partup) {
            if (partup.budget_type && partup.budget_type === 'money') {
                Partups.update({ _id: partup._id }, {
                    $set: {
                        type: Partups.TYPE.COMMERCIAL,
                        type_commercial_budget: partup.budget_money,
                        type_organization_budget: null
                    },
                    $unset: {
                        budget_type: '',
                        budget_money: '',
                        budget_hours: ''
                    }
                });
            } else if (partup.budget_type && partup.budget_type === 'hours') {
                Partups.update({ _id: partup._id }, {
                    $set: {
                        type: Partups.TYPE.ORGANIZATION,
                        type_commercial_budget: null,
                        type_organization_budget: partup.budget_hours
                    },
                    $unset: {
                        budget_type: '',
                        budget_money: '',
                        budget_hours: ''
                    }
                });
            } else if (partup.budget_type === null) {
                Partups.update({ _id: partup._id }, {
                    $set: {
                        type: Partups.TYPE.CHARITY,
                        type_commercial_budget: null,
                        type_organization_budget: null
                    },
                    $unset: {
                        budget_type: '',
                        budget_money: '',
                        budget_hours: ''
                    }
                });
            }
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 22,
    name: 'Add new email settings to existing users',
    up: function () {
        Meteor.users.update({}, {
            '$set': {
                'profile.settings.email.invite_upper_to_partup': true
            }
        }, { multi: true });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 23,
    name: 'Add refreshed_at property to partups',
    up: function () {
        Partups.update({}, {
            $set: {
                refreshed_at: new Date()
            }
        }, { multi: true });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 24,
    name: 'Gather and store all part-up languages so far',
    up: function () {
        var languages = [];
        Partups.find({}).forEach(function (partup) {
            languages.push(partup.language);
        });

        var uniqueLanguages = lodash.unique(languages);
        uniqueLanguages.forEach(function (languageCode) {
            Partup.server.services.language.addNewLanguage(languageCode);
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 25,
    name: 'Default all contributions and commercial partups to EUR currency',
    up: function () {
        Partups.find({ type: Partups.TYPE.COMMERCIAL, currency: { $exists: false } }).forEach(function (partup) {
            Partups.update({ _id: partup._id }, { $set: { currency: 'EUR' } });
        });
        Contributions.find({ rate: { $ne: null } }, { currency: { $exists: false } }).forEach(function (contribution) {
            Contributions.update({ _id: contribution._id }, { $set: { currency: 'EUR' } });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 26,
    name: 'Update all profiles that have NaN or 0 as completeness score',
    up: function () {
        Meteor.users.find().fetch().forEach(function (user) {
            if (user.completeness > 0 && user.completeness <= 100) return;

            // Update profile completion percentage on users that don't have a valid score
            Partup.server.services.profile_completeness.updateScore(user);
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 27,
    name: 'Move the tiles array from user root object to user.profile',
    up: function () {
        Meteor.users.find().fetch().forEach(function (user) {
            var tiles = user.tiles;
            if (!tiles) return;

            // Update user
            Meteor.users.update(user._id, { $unset: { tiles: '' }, $set: { 'profile.tiles': tiles } });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 28,
    name: 'Add upper_count to network',
    up: function () {
        Networks.find().fetch().forEach(function (network) {
            Networks.update(network._id, {
                $set: {
                    upper_count: (network.uppers || []).length
                }
            });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 29,
    name: 'Set new email notification setting',
    up: function () {
        Meteor.users.find().forEach(function (user) {
            Meteor.users.update(user._id, {
                $set: {
                    'profile.settings.email.partups_new_comment_in_involved_conversation': true,
                    'profile.settings.email.partups_networks_new_upper': true,
                    'profile.settings.email.partups_networks_upper_left': true
                }
            });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 30,
    name: 'Convert admin_id string to admins array for all networks',
    up: function () {
        Networks.find().fetch().forEach(function (network) {
            if (!network.admin_id) return;
            Networks.update(network._id, {
                $set: {
                    admins: [network.admin_id]
                },
                $unset: {
                    admin_id: ''
                }
            });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 31,
    name: 'Set counter on all existing chats',
    up: function () {
        // Networks go first
        Networks.find().fetch().forEach(function (network) {
            if (!network.chat_id) return;
            // Add the users to the counter
            var chat = Chats.findOneOrFail(network.chat_id);
            var uppers = network.uppers || [];
            uppers.forEach(function (upperId) {
                chat.addUserToCounter(upperId);
            });
        });
        // And now the users
        Meteor.users.find().forEach(function (user) {
            if (!user.chats || user.chats.length < 1) return;
            user.chats.forEach(function (chatId) {
                var chat = Chats.findOneOrFail(chatId);
                chat.addUserToCounter(user._id);
            })
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 32,
    name: 'Make sure all networks have chats',
    up: function () {
        Networks.find({
            chat_id: {
                $exists: false
            }
        }).forEach(function (network) {
            var chatId = Chats.insert({
                'created_at': new Date(),
                'updated_at': new Date(),
                started_typing: [],
                counter: network.uppers.map(function (userId) {
                    return {
                        user_id: userId,
                        unread_count: 0
                    };
                })
            });

            var chat = Chats.findOne(chatId);

            Networks.update(network._id, {
                $set: {
                    chat_id: chatId
                }
            });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 33,
    name: 'Add network mentions to default email notification setting',
    up: function () {
        Meteor.users.find().forEach(function (user) {
            Meteor.users.update(user._id, {
                $set: {
                    'profile.settings.email.upper_mentioned_in_network_chat': true
                }
            });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 34,
    name: 'Add new email notification setting',
    up: function () {
        Meteor.users.find().forEach(function (user) {
            Meteor.users.update(user._id, {
                $set: {
                    'profile.settings.email.partups_partner_request': true
                }
            });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 35,
    name: 'Set has_documents and has_links properties to current updates',
    up: function () {
        Updates.find().fetch().forEach(function (update) {
            var hasDocuments = update.type_data.documents && update.type_data.documents.length > 0 ? true : false;
            var content = update.type_data.new_value;
            if (content && typeof content === 'string') {
                var hasUrl = content.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
                hasUrl = hasUrl && hasUrl.length > 0 ? true : false;
            } else {
                hasUrl = false;
            }

            Updates.update(update._id, {
                $set: {
                    has_documents: hasDocuments,
                    has_links: hasUrl
                }
            });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 36,
    name: 'Set partup_names property on all networks',
    up: function () {
        Networks.find().fetch().forEach(function (network) {
            var partupNames = Partups.find({ network_id: network._id, deleted_at: { $exists: false }, archived_at: { $exists: false } }, { _id: 1, name: 1 }).map(function (partup) {
                return {
                    _id: partup._id,
                    name: partup.name
                };
            });

            Networks.update(network._id, {
                $set: {
                    partup_names: partupNames
                }
            });
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 37,
    name: 'Remove IDs from invite list if already upper',
    up: function () {
        Partups.find().fetch().forEach(function (partup) {
            var invited_partners = lodash.intersection(partup.invites, partup.uppers);
            if (invited_partners.length > 0) {
                Log.debug('Partner IDs found in invite list in partup ' + partup.name);
                Partups.update(partup._id, { $pull: { invites: { $in: invited_partners } } });
            }
        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 38,
    name: 'Remove partup invites for uppers that are already partner or supporter',
    up: function () {
        Partups.find().fetch().forEach(function (partup) {
            Invites.remove({ partup_id: partup._id, invitee_id: { $in: partup.uppers.concat(partup.supporters) } });

        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 39,
    name: 'Create a board with default lanes for existing partups and set the current activities',
    up: function () {
        Partups.find().fetch().forEach(function (partup) {
            // Skip partups that already have a board
            if (partup.board_id) return;

            // Create a board
            var boardId = Boards.insert({
                _id: Random.id(),
                created_at: new Date(),
                lanes: [],
                partup_id: partup._id,
                updated_at: new Date()
            });

            // Set the default board lanes
            var board = Boards.findOneOrFail(boardId);
            board.createDefaultLane();

            // Put all existing activities in Backlog
            board = Boards.findOneOrFail(boardId);
            var backlogLaneId = board.lanes[0];
            var activityIds = Activities.find({ partup_id: partup._id }, { _id: 1 }).map(function (activity) {
                return activity._id;
            });

            // Set Backlog lane ID to activities
            Activities.update({ _id: { $in: activityIds } }, { $set: { lane_id: backlogLaneId } }, { multi: true });
            // Set activities in lane
            Lanes.update(backlogLaneId, { $set: { activities: activityIds } });
            // And lastly, connect board to partup and set the default view mode to false (classic view)
            Partups.update(partup._id, { $set: { board_id: boardId, board_view: false } });

        });
    },
    down: function () {
        //
    }
});

Migrations.add({
    version: 40,
    name: 'Correct the lanes that contain wrong activities',
    up: function () {
        Activities.find().fetch().forEach(function (activity) {
            var partup = null;
            var board = null;

            // Set the Backlog lane if there is no lane attached
            if (!activity.lane_id) {
                partup = Partups.findOne(activity.partup_id);
                if (!partup) return;
                board = Boards.findOneOrFail(partup.board_id);
                Activities.update({ _id: activity._id }, { $set: { lane_id: board.lanes[0] } });

                // Only add to the lane if its not removed
                if (!activity.isRemoved()) Lanes.update({ _id: board.lanes[0] }, { $addToSet: { activities: activity._id } });

                // That's enough for this activity
                return;
            }

            // No further actions needed for removed activities
            if (activity.isRemoved()) return;

            // Get lane from activity
            var lane = Lanes.findOne(activity.lane_id);
            // Lane has already been removed, add to Backlog lane
            if (!lane) {
                partup = Partups.findOne(activity.partup_id);
                if (!partup) return;
                board = Boards.findOneOrFail(partup.board_id);
                Activities.update({ _id: activity._id }, { $set: { lane_id: board.lanes[0] } });
                Lanes.update({ _id: board.lanes[0] }, { $addToSet: { activities: activity._id } });

                // That's enough for this activity
                return;
            }
            // Check if activity exists in lane
            if (lane.activities.indexOf(activity._id) > -1) return;

            // At this point, the lane is not in sync with the activity. We need to get to work...
            // Get all activities the lane holds
            var laneActivities = lane.activities || [];
            // If the containing activities are actually marked as deleted, remove from lane
            laneActivities.forEach(function (activityId) {
                var laneActivity = Activities.findOneOrFail(activityId);
                if (laneActivity.isRemoved()) lane.removeActivity(laneActivity._id);
            });
            // No more deleted activities in this lane. Add current activity to lane
            lane.addActivity(activity._id);
        });
    },
    down: function () {
        //
    }
});

// Part 1 of sector migration, see 42 for part 2.
Migrations.add({
    version: 41,
    name: 'Add translatable sectors and update networks with new sector id',
    up: function () {
        Sectors.find({ name: { $exists:false } }).fetch().forEach(s => {
            let id = Random.id()
            let phrase = s._id.toLowerCase().replace(' ', '').replace(/[^a-zA-Z0-9]+/, '_')

            Sectors.insert({ _id: id, name: s._id, phrase_key: 'network-settings-sector-' + phrase })
            Networks.update({ sector: s._id }, { $set: { sector_id: id } }, { multi:true })
        })
    },
    down: function () {
        // ...
    }
})

// This migration is a follow-up of 41.
Migrations.add({
    version: 42,
    name: 'Remove old sectors and network.sector key from database',
    up: function () {
        Sectors.remove({ phrase_key: { $exists:false } })
        Networks.update({}, { $unset: { sector: '' } }, { multi: true })
    },
    down: function () {
        //...
    }
})

/* To be executed on a later stage */
// Migrations.add({
//   version: 43,
//   name: 'Remove meurs data from user documents',
//   up: function() {
//     Meteor.users.update({}, { $unset: { 'profile.meurs': ''}}, { multi: true });
//   },
//   down: function() {
//     // ...
//   }
// });

// Migrations.add({
//   version: 44,
//   name: 'Set default profile visibility to public',
//   up() {
//     Meteor.users.update({ profileVisibility: { $exists: false } }, { $set: { profileVisibility: 'public' } }, { multi: true })
//   },
//   down() {
//     // ...
//   }
// });

// DO NOT ADD Migrations.migrateTo() here!!! This is controlled by the ENV_VAR 'MIGRATE'
