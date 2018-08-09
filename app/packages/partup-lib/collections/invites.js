/**
 * Invites can contain:
 * - Invitations to a Part-up activity
 * - Invitations to a network
 * @namespace Invites
 * @memberof Collection
 */
Invites = new Mongo.Collection('invites');

// Add indices
if (Meteor.isServer) {
    Invites._ensureIndex('type');
    Invites._ensureIndex('network_id');
    Invites._ensureIndex('inviter_id');
    Invites._ensureIndex('invitee_id');
    Invites._ensureIndex('activity_id');
}

/**
 * Find invites for a user
 *
 * @memberOf Invites
 * @param {User} user
 * @return {Mongo.Cursor}
 */
Invites.findForUser = function(user) {
    return Invites.find({invitee_id: user._id});
};

/**
 * Find invites for a network
 *
 * @memberOf Invites
 * @param {Network} network
 * @return {Mongo.Cursor}
 */
Invites.findForNetwork = function(network) {
    return Invites.find({network_id: network._id});
};

/**
 * @memberof Invites
 * @public
 */
Invites.INVITE_TYPE_ACTIVITY_EMAIL = 'activity_email';

/**
 * @memberof Invites
 * @public
 */
Invites.INVITE_TYPE_ACTIVITY_EXISTING_UPPER = 'activity_existing_upper';

/**
 * @memberof Invites
 * @public
 */
Invites.INVITE_TYPE_NETWORK_EMAIL = 'network_email';

/**
 * @memberof Invites
 * @public
 */
Invites.INVITE_TYPE_NETWORK_EXISTING_UPPER = 'network_existing_upper';

/**
 * @memberof Invites
 * @public
 */
Invites.INVITE_TYPE_PARTUP_EMAIL = 'partup_email';

/**
 * @memberof Invites
 * @public
 */
Invites.INVITE_TYPE_PARTUP_EXISTING_UPPER = 'partup_existing_upper';

Invites.INVITE_STATUS = Object.freeze({
  ACCEPTED: 'accepted',
  PENDING: 'pending',
  REJECTED: 'rejected',
});
