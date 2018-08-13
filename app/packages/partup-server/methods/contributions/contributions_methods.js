Meteor.methods({
    /**
     * Add current user contribution to activity
     *
     * @param {string} activityId
     * @param {mixed[]} fields
     */
    'contributions.update': function(activityId, fields) {
        check(activityId, String);
        check(fields, Partup.schemas.forms.contribution);

        var upper = Meteor.user();
        if (!upper) throw new Meteor.Error(401, 'unauthorized');

        var activity = Activities.findOneOrFail(activityId);
        var contribution = Contributions.findOne({activity_id: activityId, upper_id: upper._id});
        var isUpperInPartup = User(upper).isPartnerInPartup(activity.partup_id);
        var contributionInvite = Invites.findOne({
          invitee_id: upper._id,
          activity_id: activityId,
          status: Invites.INVITE_STATUS.PENDING,
        });

        if (!isUpperInPartup && contributionInvite != null) {
          // If you are invited you should automatically become an upper in the partup.
          try {
            Partups.findOne({
              _id: activity.partup_id,
            }).makePartner(upper._id);

            isUpperInPartup = true;
          } catch (error) {}
        }

        try {
            var newContribution = Partup.transformers.contribution.fromFormContribution(fields);

            if (contribution) {
                // Update contribution
                newContribution.updated_at = new Date();
                newContribution.verified = isUpperInPartup;

                // Unarchive contribution if it was archived
                if (contribution.archived) {
                    newContribution.archived = false;
                }

                Contributions.update(contribution._id, {$set: newContribution});

                if (newContribution.motivation) {
                    Meteor.call('updates.comments.insert', activity.update_id, newContribution.motivation);
                }

                // Post system message
                var cause = false;

                if (contribution.archived && !newContribution.archived) {
                    cause = 'archived';
                }

                // When there's a cause, it means that the system_message will be created somewhere else
                if (!cause) {
                    Partup.server.services.system_messages.send(upper, activity.update_id, 'system_contributions_updated', {update_timestamp: false});
                }
            } else {
                // Insert contribution
                newContribution.created_at = new Date();
                newContribution.activity_id = activityId;
                newContribution.upper_id = upper._id;
                newContribution.partup_id = activity.partup_id;
                newContribution.verified = isUpperInPartup;

                newContribution._id = Contributions.insert(newContribution);

                if (newContribution.motivation) {
                    Meteor.call('updates.comments.insert', activity.update_id, newContribution.motivation);
                }
            }

            if (contributionInvite) {
              Invites.update(contributionInvite._id, {
                status: Invites.INVITE_STATUS.ACCEPTED,
              });
            }

            return newContribution;
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'contribution_could_not_be_updated');
        }
    },

    /**
     * Accept a contribution from non partupper and make that user a partupper
     *
     * @param {string} contributionId
     * */
    'contributions.accept': function(contributionId) {
        check(contributionId, String);

        var upper = Meteor.user();
        var contribution = Contributions.findOneOrFail(contributionId);
        var activity = Activities.findOne({_id: contribution.activity_id});
        var partup = Partups.findOne(contribution.partup_id);

        if (!partup.hasUpper(upper._id)) throw new Meteor.Error(401, 'unauthorized');

        try {
            // Allowing contribution means that all concept contributions by this user will be allowed
            var conceptContributions = Contributions.find({
                partup_id: activity.partup_id,
                upper_id: contribution.upper_id,
                verified: false
            }, {fields: {_id: 1, update_id: 1}}).fetch();
            var conceptContributionsIdArray = _.pluck(conceptContributions, '_id');

            Contributions.update({_id: {$in: conceptContributionsIdArray}}, {$set: {verified: true}}, {multi: true});

            // Update the update
            var set = {
                upper_id: upper._id,
                type: 'partups_contributions_accepted',
                updated_at: new Date()
            };
            Updates.update({_id: contribution.update_id}, {$set: set});

            // Promote the user from Supporter to Upper and remove any activity invites sent to user
            partup.makeSupporterPartner(contribution.upper_id);
            activity.removeAllUpperInvites(contribution.upper_id);

            Event.emit('partups.uppers.inserted', contribution.partup_id, contribution.upper_id);
            Event.emit('contributions.accepted', upper._id, contribution.activity_id, contribution.upper_id);

            // Post system message for each accepted contribution
            conceptContributions.forEach(function(contribution) {
                if (contribution.update_id) {
                    Partup.server.services.system_messages.send(upper, activity.update_id, 'system_contributions_accepted', {update_timestamp: false});
                }
            });
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'contribution_could_not_be_accepted');
        }
    },

    /**
     * Reject a concept contribution
     *
     * @param {string} contributionId
     */
    'contributions.reject': function(contributionId) {
        check(contributionId, String);

        var upper = Meteor.user();
        var contribution = Contributions.findOneOrFail(contributionId);
        var activity = Activities.findOneOrFail(contribution.activity_id);

        if (!User(upper).isPartnerInPartup(contribution.partup_id)) throw new Meteor.Error(401, 'unauthorized');

        try {
            // Archive contribution instead of removing
            Contributions.update(contribution._id, {$set: {archived: true}});

            // Post system message
            Partup.server.services.system_messages.send(upper, activity.update_id, 'system_contributions_rejected', {update_timestamp: false});

            Event.emit('contributions.rejected', upper._id, contribution.activity_id, contribution.upper_id);
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'contribution_could_not_be_rejected');
        }
    },

    /**
     * Archive a Contribution
     *
     * @param {string} contributionId
     */
    'contributions.archive': function(contributionId) {
        check(contributionId, String);

        var upper = Meteor.user();
        var contribution = Contributions.findOneOrFail(contributionId);
        var activity = Activities.findOneOrFail(contribution.activity_id);

        if (!upper || contribution.upper_id !== upper._id) {
          throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            Contributions.update(contribution._id, {$set: {archived: true}});

            // Post system message
            Partup.server.services.system_messages.send(upper, activity.update_id, 'system_contributions_removed', {update_timestamp: false});

            Event.emit('partups.contributions.archived', upper._id, contribution);

            return {
                _id: contribution._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(500, 'contribution_could_not_be_archived');
        }
    }
});
