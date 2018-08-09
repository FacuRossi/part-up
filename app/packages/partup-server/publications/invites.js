Meteor.publishComposite('invites.for_activity_id', function(activityId) {
    check(activityId, String);

    this.unblock();

    return {
        find: function() {
            return Invites.find({activity_id: activityId});
        },
        children: [
            {find: Meteor.users.findForInvite}
        ]
    };
});

Meteor.publish('invites.my_activity_invites', function () {
  const selector = {
    invitee_id: this.userId,
    type: Invites.INVITE_TYPE_ACTIVITY_EXISTING_UPPER,
    status: Invites.INVITE_STATUS.PENDING,
  };

  return Invites.find(selector);
});

Meteor.routeComposite('invites/me', function(request, parameters) {
    const userId = parameters.query.userId || this.userId;

    const options = { sort: { created_at: -1 } };
    options.limit = parseInt(lodash.get(parameters, 'query.limit')) || 25;
    options.skip = parseInt(lodash.get(parameters, 'query.skip')) || 0;

    const inviteSelector = {
        invitee_id: userId,
    };

    if (get(parameters.query, 'filterByActivities') === 'true') {
        inviteSelector.type = 'activity_existing_upper';
    }

    if (get(parameters.query, 'filterByTribes') === 'true') {
        inviteSelector.type = 'network_existing_upper';
    }

    if (get(parameters.query, 'filterByPartups') === 'true') {
        inviteSelector.type = 'partup_existing_upper';
    }

    const invitesCursor = Invites.find(inviteSelector, options)

    const dedupde = (arr) => [...new Set(arr)];

    const partupIds = dedupde(invitesCursor.map(({ partup_id }) => partup_id));
    const userIds = dedupde(invitesCursor.map(({ inviter_id }) => inviter_id));
    const activityIds = dedupde(invitesCursor.map(({ activity_id }) => activity_id));
    const networkIds = dedupde(invitesCursor.map(({ network_id }) => network_id));

    const usersCursor = Meteor.users.find(
        { _id: { $in: userIds } },
        { fields: { '_id': 1, 'profile.name': 1 }},
    );

    const activitiesCursor = Activities.find(
        { _id: { $in: activityIds } },
        { fields: { '_id': 1, 'name': 1, 'partup_id': 1, 'update_id': 1}},
    );

    const networksCursor = Networks.find(
        { _id: { $in: networkIds } },
        { fields: { '_id': 1, 'name': 1, 'image': 1, 'slug': 1}},
    );

    const activityPartupIds = dedupde(activitiesCursor.map(({ partup_id })=> partup_id))

    const partupsCursor = Partups.find({
        _id: { $in: dedupde(partupIds.concat(activityPartupIds)) },
    }, {
        fields: { _id: 1, name: 1, image: 1, slug: 1 },
    });

    const imagesCursor = Images.findForCursors([{
        cursor: partupsCursor,
        imageKey: 'image',
    }, {
        cursor: networksCursor,
        imageKey: 'image',
    }]);

    return {
        find: () => Meteor.users.find({_id: userId}),
        children: [
            { find: () => invitesCursor },
            { find: () => partupsCursor },
            { find: () => activitiesCursor },
            { find: () => networksCursor },
            { find: () => usersCursor },
            { find: () => imagesCursor },
        ],
    };
});

Meteor.publishComposite('invites.new_invites_count', function({dateFrom}) {
    const user = Meteor.user();

    const selector = {
        invitee_id: user._id,
    };

    const invitesCursor = Invites.find(selector, {fields: {_id: 1, invitee_id: 1}});

    return {
        find: () => invitesCursor,
    };
});
