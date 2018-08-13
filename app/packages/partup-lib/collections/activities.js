/**
 * @ignore
 */
Activity = function(document) {
    _.extend(this, document);
};

/**
 * Check if the activity is open
 *
 * @memberof Activities
 * @return {Boolean}
 */
Activity.prototype.isOpen = function() {
    return Contributions.findForActivity(this).count() === 0;
};

/**
 * Check if the activity is closed
 *
 * @memberof Activities
 * @return {Boolean}
 */
Activity.prototype.isClosed = function() {
    return Contributions.findForActivity(this).count() > 0;
};

/**
 * Check if upper is already invited to the activity
 *
 * @memberof Activities
 * @param {String} upperId the user id of the user to be checked
 * @return {Boolean}
 */
Activity.prototype.isUpperInvited = function(upperId) {
    return !!Invites.findOne({activity_id: this._id, invitee_id: upperId, type: Invites.INVITE_TYPE_ACTIVITY_EXISTING_UPPER});
};

/**
 * Remove all invites for a specific user for this activity
 *
 * @memberof Activities
 * @param {String} upperId id of the user whose invites have to be removed
 */
Activity.prototype.removeAllUpperInvites = function(upperId) {
    Invites.remove({activity_id: this._id, invitee_id: upperId});
};

/**
 * Soft delete an activity
 *
 * @memberOf Activities
 */
Activity.prototype.remove = function() {
    Partups.update(this.partup_id, {$inc: {activity_count: -1}});

    Activities.update(this._id, {$set: {deleted_at: new Date}});
};

/**
 * Check whether or not an activity is removed
 *
 * @memberOf Activities
 * @return {Boolean}
 */
Activity.prototype.isRemoved = function() {
    return !!this.deleted_at;
};

/**
 * Activities are units of work that a partup consists of
 *
 * @namespace Activities
 * @memberOf Collection
 */
Activities = new Mongo.Collection('activities', {
    transform: function(document) {
        return new Activity(document);
    }
});

// Add indices
if (Meteor.isServer) {
    Activities._ensureIndex('creator_id');
    Activities._ensureIndex('partup_id');
    Activities._ensureIndex('update_id');
}

Activities.findForUser = function (userId, selector, options) {
  const userPartupCursor = Partups.guardedFind(userId, {
    archived_at: {
      $exists: false,
    },
    uppers: {
      $elemMatch: {
        $eq: userId,
      },
    },
  }, {
    fields: {
      _id: 1,
      name: 1,
      image: 1,
      uppers: 1,
      slug: 1,
    }
  });

  const userContributionCursor = Contributions.find({
    partup_id: {
      $in: userPartupCursor.map(p => p._id),
    },
    upper_id: userId,
    archived: {
      $ne: true,
    }
  });

  const activityCursor = Activities.find({
    _id: {
      $in: userContributionCursor.map(c => c.activity_id),
    },
    deleted_at: {
      $exists: false,
    },
    archived: {
      $ne: true,
    }
  });

  return activityCursor;
}

/**
 * Find one document, throw an error if it doesn't exist.
 *
 * @memberof Activities
 * @return {Activity}
 */
Activities.findOneOrFail = function(selector, options) {
    // We do not want to return activities that have been soft deleted
    selector.deleted_at = selector.deleted_at || {$exists: false};

    var activity = this.findOne(selector, options);

    if (!activity) throw new Meteor.Error(404, 'activity_could_not_be_found');

    return activity;
};


/**
 * Find activity for an update
 *
 * @memberOf Activities
 * @param {Update} update
 * @return {Mongo.Cursor|Void}
 */
Activities.findForUpdate = function(update) {
    if (!update.isActivityUpdate()) return;

    return Activities.find({_id: update.type_data.activity_id}, {limit: 1});
};

/**
 * Find activity for an update
 *
 * @memberOf Activities
 * @param {Update} update
 * @return {Mongo.Cursor|Void}
 */
Activities.findForUpdateIds = function(updateIds) {
    options = options || {};
    parameters = parameters || {};

    const selector = {update_id: {$in: updateIds} }

    return this.guardedFind(null, selector, options);
};

/**
 * Find activity for contribution
 *
 * @memberOf Activities
 * @param {Contribution} contribution
 * @return {Mongo.Cursor}
 */
Activities.findForContribution = function(contribution) {
    return Activities.find({_id: contribution.activity_id}, {limit: 1});
};

/**
 * Find activities for partup
 *
 * @memberOf Activities
 * @param {Contribution} contribution
 * @return {Mongo.Cursor}
 */
Activities.findForPartup = function(partup, options, parameters) {
    options = options || {};
    parameters = parameters || {};

    var selector = {
        partup_id: partup._id
    };

    if (parameters.hasOwnProperty('archived')) {
        selector.archived = !!parameters.archived;
    }

    return this.guardedFind(null, selector, options);
};

/**
 * Find activities for partup ids.
 *
 * @memberOf Activities
 * @param {Contribution} contribution
 * @return {Mongo.Cursor}
 */
Activities.findForActivityIds = function(activityIds, options, parameters) {
    options = options || {};
    parameters = parameters || {};

    return this.aggregate([
        {
            $match: {
                _id: { $in: activityIds },
                $or: [{ end_date: { $gte: new Date()} }, { end_date: null }],
                archived: parameters.archived,
            },
        },
        {
            $project: {
                nlt: { $ifNull: ['$end_date', new Date('2030-01-01')] },
                document: '$$ROOT',
            },
        },
        {$sort: { 'nlt': 1 }},
        {$skip: options.skip},
        {$limit: options.limit},
    ]).map(({ document }) => document);
};


/**
 * Modified version of Collection.find that makes sure the
 * user (or guest) can only retrieve authorized entities
 *
 * @memberof Activities
 * @param {String} userId
 * @param {Object} selector
 * @param {Object} options
 * @return {Cursor}
 */
Activities.guardedFind = function(userId, selector, options) {
    var selector = selector || {};

    // We do not want to return partups that have been soft deleted
    selector.deleted_at = selector.deleted_at || {$exists: false};

    return this.find(selector, options);
};
