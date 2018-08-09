import _ from 'lodash';

Meteor.publish('activities.partup_create', function(partupId) {
  check(partupId, String);
  this.unblock();

  const partup = Partups.findOne(partupId);
  if (!partup.isViewableByUser(this.userId)) {
    return this.ready();
  }
  return Activities.find({ partup_id: partupId, archived: { $ne: true } }, { sort: { created_at: -1 } });
});

Meteor.routeComposite('/activities/me', function(request, parameters) {
    if (!this.userId) return;

    const archived = parameters.query && parameters.query.filterByArchived === 'true';
    const user = Meteor.users.findOne(this.userId, { fields: { _id: 1, upperOf: 1 } });

    const options = {};
    options.limit = parseInt(lodash.get(parameters, 'query.limit')) || 25;
    options.skip = parseInt(lodash.get(parameters, 'query.skip')) || 0;

    const partupsCursor = Partups.find({
        _id: { $in: user.upperOf },
        archived_at: null,
    }, {
        fields: { _id: 1, name: 1, image: 1, uppers: 1, slug: 1 },
    });
    const partupIds = partupsCursor.map(({_id}) => _id);

    // Get contributions that
    const userContributionCursor = Contributions.find({
        partup_id: { $in: partupIds },
        upper_id: this.userId,
    });

    const activityIds = [...new Set(userContributionCursor.map(({ activity_id }) => activity_id))];

    const activityCursor = Activities.findForActivityIds(activityIds, options, { archived });

    const contributionCursor = Contributions.find({
        activity_id: { $in: activityIds },
    });

    const userIds = contributionCursor.map(({ upper_id }) => upper_id);
    const usersCursor = Meteor.users.find(
        { _id: { $in: userIds } },
        { fields: { '_id': 1, 'profile.name': 1, 'profile.image': 1 }},
    );

    const imagesCursor = Images.findForCursors([{
        cursor: usersCursor,
        imageKey: 'profile.image',
    }]);

    return {
        find: () => Meteor.users.find({_id: this.userId}),
        children: [
            {find: () => partupsCursor},
            {find: () => ({
                fetch: () => activityCursor,
                _cursorDescription: { collectionName: 'activities' },
            })},
            {find: () => contributionCursor},
            {find: () => usersCursor},
            {find: () => imagesCursor},
        ],
    };
});

Meteor.publish('activities.me', function () {
  const userId = this.userId;

  const partupCursor = Partups.guardedFind(userId, {
    uppers: {
      $elemMatch: { $eq: userId },
    },
  }, {
    fields: {
      _id: 1,
      name: 1,
      image: 1,
      uppers: 1,
      slug: 1,
    },
  });

  const partupIds = partupCursor.map(p => p._id);

  const userContributionCursor = Contributions.find({
    partup_id: { $in: partupIds },
    upper_id: userId,
  });

  const activityIds = _.concat(
    userContributionCursor.map((c) => c.activity_id),
  );

  const activityCursor = Activities.find({
    _id: {
      $in: activityIds
    },
    deleted_at: {
      $exists: false,
    },
    archived: {
      $ne: true,
    },
  });
  const contributionCursor = Contributions.find({
    activity_id: { $in: activityIds }
  });

  const userIds = contributionCursor.map((c) => c.upper_id);

  const userCursor = Meteor.users.find({
    _id: { $in: userIds },
  });

  const updateCursor = Updates.find({
    _id: {
      $in: activityCursor.map((a) => a.update_id),
    }
  });

  return [
    partupCursor,
    activityCursor,
    contributionCursor,
    userCursor,
    updateCursor,
  ];
});


Meteor.publishComposite('activities.updated_activities', function() {
    const user = Meteor.user();

    const selector = {
        upper_data: {
            $elemMatch: {
                _id: user._id,
                new_updates: { $exists: true, $not: {$size: 0} },
            },
        },
    };

    const partupsWithUpdatesForUser = Partups.find(selector, { fields: { _id: 1, upper_data: 1 } });

    return {
        find: () => partupsWithUpdatesForUser,
        children: [
            {find: ({upper_data}) => Updates.find({
                _id: { $in: upper_data.find(({_id}) => _id === user._id).new_updates || [] },
                type: 'partups_contributions_added',
            }, {
                fields: {
                    _id: 1,
                    type: 1,
                },
            })},
        ],
    };
});
