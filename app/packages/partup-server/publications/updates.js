import { _ } from 'lodash';

Meteor.publishComposite('updates.one', function(updateId) {
  check(updateId, String);

  this.unblock();

  return {
      find: function() {
          var updateCursor = Updates.find({_id: updateId}, {limit: 1});

          var update = updateCursor.fetch().pop();
          if (!update) return;

          var partup = Partups.guardedFind(this.userId, {_id: update.partup_id}, {limit:1}).fetch().pop();
          if (!partup) return;

          return updateCursor;
      },
      children: [
        {find: Meteor.users.findUserForUpdate, children: [
          {find: Images.findForUser}
        ]},
        {find: Images.findForUpdate},
        {find: Images.findForUpdateComments},
        {find: Files.findForUpdate},
        {find: Activities.findForUpdate},
        {find: Contributions.findForUpdate, children: [
            {find: Activities.findForContribution},
            {find: Ratings.findForContribution, children: [
                {find: Meteor.users.findForRating, children: [
                    {find: Images.findForUser}
                ]}
            ]}
        ]}
      ]
  };
});

Meteor.publish('updates.single', function(updateId, partupId) {
  check(updateId, String);
  check(partupId, String);

  const partup = Partups.guardedFind(this.userId, { _id: partupId }, { limit: 1 }).fetch().pop();

  if (partup) {
    // Update
    const cursor = Updates.find({ _id: updateId }, { limit: 1 });
    const update = cursor.fetch().pop();

    // Uppers
    const commentUpperIds = _.get(update, 'comments', []).map((comment) => comment.creator._id)
    const upperIds = _.uniq([update.upper_id, ...commentUpperIds])

    // Images
    const creator_image = Meteor.users.findSinglePublicProfile(update.upper_id).fetch().pop().profile.image

    let typeDataImages = [];
    switch (update.type) {
      case 'partups_image_changed':
        typeDataImages = [update.type_data.old_image, update.type_data.new_image];
        break;
      case 'partups_message_added':
        typeDataImages = update.type_data.images || [];
        break;
      default:
        break;
    }

    const commentImages = _.get(update, 'comments', []).map((comment) => comment.creator.image)
    const imageIds = _.uniq([creator_image, ...typeDataImages, ...commentImages])

    const cursors = [
      cursor,
      Images.find({"_id": {"$in": imageIds}}),
      Files.findForUpdate(update),
    ]

    return cursors
  }
})

/**
 * Publish all required data for updates in a part-up
 *
 * @param {String} partupId
 * @param {Object} parameters
 * @param {Number} parameters.limit
 * @param {String} parameters.filter
 * @param {String} accessToken
 */
Meteor.publish('updates.partup', function(partupId, parameters, accessToken) {

    check(partupId, String);
    if (accessToken) check(accessToken, String);

    parameters = parameters || {};
    check(parameters, {
        limit: Match.Optional(Number),
        skip: Match.Optional(Number),
        filter: Match.Optional(String)
    });

    this.unblock();

    const partup = Partups.guardedFind(this.userId, {_id: partupId}, {limit: 1}, accessToken).fetch().pop();
    if (!partup) return;

    const updates = Updates.findForPartup(partup, parameters, this.userId)

    const upperIds = []
    const imageIds = []
    const fileIds = []

    updates.forEach((update) => {

        // Upper ID is only available for non-system updates
        if (update.upper_id) {
            upperIds.push(update.upper_id)

            // Find the image id associated with the user
            upperImageId = _.get(Meteor.users.findSinglePublicProfile(update.upper_id).fetch().pop(), 'profile.image')
            if (upperImageId) {
                imageIds.push(upperImageId)
            }
        }
        // Attached file to update
        fileIds.push(_.get(update, 'type_data.documents', []))

        // Comment user Ids
        _.get(update, 'comments', []).map((comment) => upperIds.push(comment.creator._id))

        // Any comment profile images
        _.get(update, 'comments', []).map((comment) => imageIds.push(comment.creator.image))
    })

    const cursors = [
      Meteor.users.findMultiplePublicProfiles(_.uniq(upperIds)),
      Images.find({"_id": {"$in": _.uniq(imageIds)}}),
      Files.find({"_id": {"$in": _.flatten(fileIds)}})
    ]

    return [
        updates,
        ...cursors
    ];
});


Meteor.publish('updates.comments_by_update_ids', function(updateIds) {
    check(updateIds, [String]);

    this.unblock();

    const selector = {
        _id: {$in: updateIds},
    };

    const options = {
        fields: {
            comments: 1,
            comments_count: 1,
        },
    };

    return [
        Updates.find(selector, options)
    ]
});

Meteor.publish('updates.new_conversations', function({dateFrom}) {
    const user = Meteor.user();

    const partupIds = [
        ...(user.upperOf || []),
        ...(user.supporterOf || []),
    ];

    const options = {
        sort: {updated_at: -1},
        fields: {_id: 1, updated_at: 1},
    };

    const selector = {
        $or: [
            {type: 'partups_message_added'},
            {type: 'partups_activities_comments_added'},
            {comments_count: {$gt: 0}},
        ],
        archived_at: {$exists: false},
        deleted_at: {$exists: false},
        updated_at: {$gte: dateFrom},
        partup_id: {$in: partupIds},
    };

    return [
        Updates.find(selector, options),
    ]
})

Meteor.publishComposite('updates.new_conversations_count', function({dateFrom}) {
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
            {find: ({upper_data}) => Updates.find({_id: {$in: upper_data.find(({_id}) => _id === user._id).new_updates || []}}, {fields: {_id: 1}})},
        ],
    };
});
