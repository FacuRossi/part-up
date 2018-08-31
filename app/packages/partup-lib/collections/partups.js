/**
 * @memberOf Partups
 * @private
 */
var PUBLIC = 1; // Deprecated!
/**
 * @memberOf Partups
 * @private
 */
var PRIVATE = 2; // Deprecated!
/**
 * @memberOf Partups
 * @private
 */
var NETWORK_PUBLIC = 3;
/**
 * @memberOf Partups
 * @private
 */
var NETWORK_INVITE = 4;
/**
 * @memberOf Partups
 * @private
 */
var NETWORK_CLOSED = 5;
/**
 * @memberOf Partups
 * @private
 */
var NETWORK_ADMINS = 6;
/**
 * @memberOf Partups
 * @private
 */
var NETWORK_COLLEAGUES = 7;
/**
 * @memberOf Partups
 * @private
 */
var NETWORK_COLLEAGUES_CUSTOM_A = 8;
/**
 * @memberOf Partups
 * @private
 */
var NETWORK_COLLEAGUES_CUSTOM_B = 9;
/**
 * @memberOf Partups
 * @private
 */
var TYPE = {
    CHARITY: 'charity',
    ENTERPRISING: 'enterprising',
    COMMERCIAL: 'commercial',
    ORGANIZATION: 'organization'
};
/**
 * @memberOf Partups
 * @private
 */
var PHASE = {
    BRAINSTORM: 'brainstorm',
    PLAN: 'plan',
    EXECUTE: 'execute',
    GROW: 'grow'
};

/**
 * @ignore
 */
var Partup = function(document) {
    _.extend(this, document);
};

/**
 * Check if a given user can edit this partup
 *
 * @memberOf Partups
 * @param {User} user the user object
 * @return {Boolean}
 */
Partup.prototype.isEditableBy = function(user) {
    if (!user) {
        return false;
    }
    return (
        this.hasUpper(user._id) ||
        User(user).isAdminOfNetwork(this.network_id) ||
        User(user).isAdmin()
    );
};

/**
 * Check if a given user is the creator of this partup
 *
 * @memberOf Partups
 * @param {User} user the user object
 * @return {Boolean}
 */
Partup.prototype.isCreatedBy = function(user) {
    return user && this.creator_id === user._id;
};

/**
 * Check if a given user can remove this partup
 *
 * @memberOf Partups
 * @param {User} user the user object
 * @return {Boolean}
 */
Partup.prototype.isRemovableBy = function(user) {
    return user && (this.creator_id === user._id || User(user).isAdmin());
};

/**
 * Check whether or not a partup is removed
 *
 * @memberOf Partups
 * @return {Boolean}
 */
Partup.prototype.isRemoved = function() {
    return !!this.deleted_at;
};

/**
 * Check if given user is a supporter of this partup
 *
 * @memberOf Partups
 * @param {String} userId the id of the user that should be checked
 * @return {Boolean}
 */
Partup.prototype.hasSupporter = function(userId) {
    if (!this.supporters) return false;
    return mout.lang.isString(userId) && this.supporters.indexOf(userId) > -1;
};

/**
 * Check if given user is an upper in this partup
 *
 * @memberOf Partups
 * @param {String} userId the id of the user that should be checked
 * @return {Boolean}
 */
Partup.prototype.hasUpper = function(userId) {
    if (!this.uppers) return false;
    return mout.lang.isString(userId) && this.uppers.indexOf(userId) > -1;
};

Partup.prototype.hasSupporterOrUpper = function(userId) {
    return this.hasSupporter(userId) || this.hasUpper(userId);
}

/**
 * Check if given user is a pending partner of this partup
 *
 * @memberOf Partups
 * @param {String} userId the id of the user that should be checked
 * @return {Boolean}
 */
Partup.prototype.hasPendingPartner = function(userId) {
    if (!this.pending_partners) return false;
    return mout.lang.isString(userId) && this.pending_partners.indexOf(userId) > -1;
};

/**
 * Check if given user is on the invite list of this partup
 *
 * @memberOf Partups
 * @param {String} userId the id of the user to check against
 * @return {Boolean}
 */
Partup.prototype.hasInvitedUpper = function(userId) {
    if (!this.invites) return false;
    return mout.lang.isString(userId) && this.invites.indexOf(userId) > -1;
};

/**
 * Check if given user has the right to view the partup
 *
 * @memberOf Partups
 * @param {String} userId
 * @param {String} accessToken
 * @return {Boolean}
 */
Partup.prototype.isViewableByUser = function(userId, accessToken) {
    var user = Meteor.users.findOne(userId);
    var isAdminOfNetwork = User(user).isAdminOfNetwork(this.network_id);
    var isColleagueOfNetwork = User(user).isColleagueOfNetwork(this.network_id);
    var isColleagueCustumAOfNetwork = User(user).isColleagueCustomAOfNetwork(this.network_id);
    var isColleagueCustumBOfNetwork = User(user).isColleagueCustomBOfNetwork(this.network_id);

    switch (this.privacy_type) {
        case PUBLIC:
        case NETWORK_PUBLIC:
            return true;
        case NETWORK_ADMINS:
            if (isAdminOfNetwork) return true;
        case NETWORK_COLLEAGUES:
            if (isAdminOfNetwork || isColleagueOfNetwork) return true;
        case NETWORK_COLLEAGUES_CUSTOM_A:
            if (isAdminOfNetwork || isColleagueOfNetwork || isColleagueCustumAOfNetwork) return true;
        case NETWORK_COLLEAGUES_CUSTOM_B:
            if (isAdminOfNetwork || isColleagueOfNetwork || isColleagueCustumAOfNetwork || isColleagueCustumBOfNetwork) return true;
        case PRIVATE:
        case NETWORK_INVITE:
        case NETWORK_CLOSED:
            var accessTokens = this.access_tokens || [];
            if (accessTokens.indexOf(accessToken) > -1) return true;

            if (!user) return false;
            var networks = user.networks || [];
            if (networks.indexOf(this.network_id) > -1) return true;

            if (this.hasSupporter(userId)) return true;
            if (this.hasUpper(userId)) return true;
            if (this.hasInvitedUpper(userId)) return true;
    }

    return false;
};

/**
 * Check if a partup has ended
 *
 * @return {Boolean}
 */
Partup.prototype.hasEnded = function() {
    var now = new Date;
    var endDate = this.endDate;

    return now < endDate;
};

/**
 * Make the upper a supporter
 *
 * @memberOf Partups
 * @param {String} upperId the user that becomes a supporter
 */
Partup.prototype.makeSupporter = function(upperId) {
    if (this.hasUpper(upperId)) return;

    Partups.update(this._id, { $addToSet: { 'supporters': upperId }, $pull: { invites: upperId } });
    Meteor.users.update(upperId, { $addToSet: { 'supporterOf': this._id } });
    Invites.remove({ partup_id: this._id, invitee_id: upperId });
    PartupUserSettings.setLandingPage(this._id, upperId, 'conversations');

    this.createUpperDataObject(upperId);
};

/**
 * Promote a user from supporter to partner
 *
 * @memberOf Partups
 * @param {String} upperId the user that gets promoted
 */
Partup.prototype.makeSupporterPartner = function(upperId) {
  this.makePartner(upperId);
};

/**
 * Demote a user from partner to supporter
 *
 * @memberOf Partups
 * @param {String} upperId the user that gets demoted
 */
Partup.prototype.makePartnerSupporter = function(upperId) {
    Partups.update(this._id, { $pull: { 'uppers': upperId }, $addToSet: { 'supporters': upperId } });
    Meteor.users.update(upperId, { $pull: { 'upperOf': this._id }, $addToSet: { 'supporterOf': this._id } });
};

/**
 * Promote a user from supporter to partner
 *
 * @memberOf Partups
 * @param {String} upperId the user that gets promoted
 */
Partup.prototype.makePartner = function(upperId) {
    Partups.update(this._id, { $pull: { 'supporters': upperId, 'invites': upperId }, $addToSet: { 'uppers': upperId } });
    Meteor.users.update(upperId, { $pull: { 'supporterOf': this._id }, $addToSet: { 'upperOf': this._id } });
    PartupUserSettings.setLandingPage(this._id, upperId, 'conversations');
};

/**
 * Consume an access token to add the user as an invitee
 *
 * @memberOf Partups
 * @param {String} upperId
 * @param {String} accessToken
 */
Partup.prototype.convertAccessTokenToInvite = function(upperId, accessToken) {
    Partups.update(this._id, { $pull: { 'access_tokens': accessToken }, $addToSet: { 'invites': upperId } });
};

/**
 * Soft delete a partup
 *
 * @memberOf Partups
 */
Partup.prototype.remove = function() {
    var supporters = this.supporters || [];
    var uppers = this.uppers || [];

    Meteor.users.update({ _id: { $in: supporters } }, { $pull: { 'supporterOf': this._id } }, { multi: true });
    Meteor.users.update({ _id: { $in: uppers } }, { $pull: { 'upperOf': this._id } }, { multi: true });

    Partups.update(this._id, { $set: { deleted_at: new Date } });
};

/**
 * Check whether or not a partup is removed
 *
 * @memberOf Partups
 * @return {Boolean}
 */
Partup.prototype.isRemoved = function() {
    return !!this.deleted_at;
};

/**
 * Get all partners and supporters
 *
 * @memberOf Partups
 */
Partup.prototype.getUsers = function() {
    var uppers = this.uppers || [];
    var supporters = this.supporters || [];

    return uppers.concat(supporters);
};

/**
 * Create the upper_data object for the given upperId
 *
 * @memberOf Partups
 */
Partup.prototype.createUpperDataObject = function(upperId) {
    Partups.update({
        _id: this._id,
        'upper_data._id': {
            $ne: upperId
        }
    }, {
        $push: {
            upper_data: {
                _id: upperId,
                new_updates: []
            }
        }
    });
};

/**
 * Remove the upper_data object for the given upperId
 *
 * @memberOf Partups
 */
Partup.prototype.removeUpperDataObject = function(upperId) {
    Partups.update({
        _id: this._id,
        'upper_data._id': upperId
    }, {
        $pull: { upper_data: { _id: upperId } }
    });
};

/**
 * Update new updates for a single user
 *
 * @memberOf Partups
 */
Partup.prototype.addNewUpdateToUpperData = function(update, currentUserId) {
    // Update existing upper data first
    var upper_data = this.upper_data || [];
    upper_data.forEach(function(upperData) {
        if (upperData._id === update.upper_id) return;
        if (upperData._id === currentUserId) return;
        upperData.new_updates.push(update._id);
    });

    // Create object for new uppers that dont have upper_data
    var currentUpperDataIds = _.map(upper_data, function(upperData) {
        return upperData._id;
    });
    var newUpperIds = _.difference(this.getUsers(), currentUpperDataIds);
    newUpperIds.forEach(function(upperId) {
        if (upperId === update.upper_id) return;
        if (upperId === currentUserId) return;
        upper_data.push({
            _id: upperId,
            new_updates: [update._id]
        });
    });

    Partups.update({ _id: this._id }, { $set: { upper_data: upper_data } });
};

/**
 * Increase email share count
 *
 * @memberOf Partups
 */
Partup.prototype.increaseEmailShareCount = function() {
    Partups.update({ _id: this._id }, { $inc: { 'shared_count.email': 1 } });
};

/**
 * Check if partup is archived
 *
 * @memberOf Partups
 * @return {Boolean}
 */
Partup.prototype.isArchived = function() {
    return !!this.archived;
};

Partup.prototype.privacyMatches = function(type) {
    var privacyType = Partups.privacy_types[type.toUpperCase()];
    if (privacyType) return privacyType === this.privacy_type;

    var networkTypes = [3, 4, 5];
    var partupHasNetworkType = networkTypes[networkTypes.indexOf(this.privacy_type)];
    if (partupHasNetworkType && type === 'network') {
        return true;
    }
    return false;
};

/**
 * Partups describe collaborations between several uppers
 * @namespace Partups
 */
Partups = new Mongo.Collection('partups', {
    transform: function(document) {
        return new Partup(document);
    }
});

// Add indices
if (Meteor.isServer) {
    Partups._ensureIndex({ 'name': 'text', 'description': 'text' }, { language_override: 'idioma' });
    Partups._ensureIndex('creator_id');
    Partups._ensureIndex('privacy_type');
    Partups._ensureIndex('slug');
    Partups._ensureIndex('progress');
    Partups._ensureIndex('tags');
    Partups._ensureIndex('deleted_at');
    Partups._ensureIndex('supporters');
    Partups._ensureIndex('uppers');
}

/**
 * @memberOf Partups
 * @private
 */
Partups.privacy_types = {
    PUBLIC: PUBLIC,
    PRIVATE: PRIVATE,
    NETWORK_PUBLIC: NETWORK_PUBLIC,
    NETWORK_INVITE: NETWORK_INVITE,
    NETWORK_CLOSED: NETWORK_CLOSED,
    NETWORK_ADMINS: NETWORK_ADMINS,
    NETWORK_COLLEAGUES: NETWORK_COLLEAGUES,
    NETWORK_COLLEAGUES_CUSTOM_A: NETWORK_COLLEAGUES_CUSTOM_A,
    NETWORK_COLLEAGUES_CUSTOM_B: NETWORK_COLLEAGUES_CUSTOM_B
};

Partups.getPrivacyTypeByValue = function(value) {
    if (!value) return false;
    var types = Partups.privacy_types;
    for (type in types) {
        if (types[type] === value) {
            return type;
        }
    }
    return false;
};

/**
 * @memberOf Partups
 * @public
 */
Partups.TYPE = TYPE;
/**
 * @memberOf Partups
 * @public
 */
Partups.PHASE = PHASE;

/**
 * ============== PARTUPS COLLECTION HELPERS ==============
 */

/**
 * Modified version of Collection.find that makes sure the
 * user (or guest) can only retrieve authorized entities
 *
 * @memberOf Partups
 * @param {String} userId
 * @param {Object} selector
 * @param {Object} options
 * @param {String} accessToken
 * @return {Cursor}
 */
Partups.guardedFind = function(userId, selector, options, accessToken) {
    // We do not want to return partups that have been soft deleted
    selector.deleted_at = selector.deleted_at || { $exists: false };

    if (Meteor.isClient) return this.find(selector, options);

    selector = selector || {};
    options = options || {};

    var guardedCriterias = [
        // Either the partup is public or belongs to a public network
        {
            'privacy_type': {
                '$in': [
                    Partups.privacy_types.PUBLIC,
                    Partups.privacy_types.NETWORK_PUBLIC
                ]
            }
        }
    ];

    // If an access token is provided, we allow access if it matches one of the partups access tokens
    if (accessToken) {
        guardedCriterias.push({ 'access_tokens': { '$in': [accessToken] } });
    }

    // Some extra rules that are only applicable to users that are logged in
    if (!!userId && userId !== 'null') {
        var user = Meteor.users.findOneOrFail(userId);
        var networks = user.networks || [];

        // The user is part of the partup uppers, which means he has access anyway
        guardedCriterias.push({ 'uppers': { '$in': [userId] } });

        // The user is part of the partup supporters, which means he has access anyway
        guardedCriterias.push({ 'supporters': { '$in': [userId] } });

        // Of course the creator of a partup always has the needed rights
        guardedCriterias.push({ 'creator_id': userId });

        // Check if upper is invited, so has the rights to view a partup in a closed network
        guardedCriterias.push({ 'invites': { '$in': [userId] } });

        // Check if upper is invited, so has the rights to view a partup in a closed network
        guardedCriterias.push({ 'invites': { '$in': [userId] } });

        // Check privacy settings
        networks.forEach(function(networkId) {
            if (User(user).isAdminOfNetwork(networkId)) {
                // Admins may view all
                guardedCriterias.push({ network_id: networkId });
            } else if (User(user).isColleagueOfNetwork(networkId)) {
                // Colleagues: hide admin partups
                guardedCriterias.push({
                    $and: [
                        { network_id: networkId },
                        { privacy_type: { $ne: Partups.privacy_types.NETWORK_ADMINS } }
                    ]
                });
            } else if (User(user).isColleagueCustomAOfNetwork(networkId)) {
                // colleagues_custom_a: hide admin and collegues partups
                guardedCriterias.push({
                    $and: [
                        { network_id: networkId },
                        {
                            privacy_type: {
                                $nin: [
                                    Partups.privacy_types.NETWORK_ADMINS,
                                    Partups.privacy_types.NETWORK_COLLEAGUES
                                ]
                            }
                        }
                    ]
                });
            } else if (User(user).isColleagueCustomBOfNetwork(networkId)) {
                // colleagues_custom_a: hide admin and collegue and colleagues_custom_a partups
                guardedCriterias.push({
                    $and: [
                        { network_id: networkId },
                        {
                            privacy_type: {
                                $nin: [
                                    Partups.privacy_types.NETWORK_ADMINS,
                                    Partups.privacy_types.NETWORK_COLLEAGUES,
                                    Partups.privacy_types.NETWORK_COLLEAGUES_CUSTOM_A
                                ]
                            }
                        }
                    ]
                });
            } else {
                // Regular members: hide all colleague and admin partups
                guardedCriterias.push({
                    $and: [
                        { network_id: networkId },
                        {
                            privacy_type: {
                                $nin: [
                                    Partups.privacy_types.NETWORK_ADMINS,
                                    Partups.privacy_types.NETWORK_COLLEAGUES,
                                    Partups.privacy_types.NETWORK_COLLEAGUES_CUSTOM_A,
                                    Partups.privacy_types.NETWORK_COLLEAGUES_CUSTOM_B
                                ]
                            }
                        }
                    ]
                });
            }
        });
    }

    var finalSelector = {};

    // MongoDB only allows 1 root $or, so we have to merge the $or from the given selector
    // with the $or values that we generate with the guarded criteria above here
    if (selector.$or) {
        finalSelector = selector;
        finalSelector.$and = [{ '$or': guardedCriterias }, { '$or': selector.$or }];
        delete finalSelector.$or;
    } else {
        // Guarding selector that needs to be fulfilled
        var guardingSelector = { '$or': guardedCriterias };

        // Merge the selectors, so we still use the initial selector provided by the caller
        finalSelector = { '$and': [guardingSelector, selector] };
    }

    return this.find(finalSelector, options);
};

/**
 * Modified version of Collection.find that makes
 * sure the user (or guest) can only retrieve
 * fields that are publicly available
 *
 * @memberOf Partups
 * @param {Object} selector
 * @param {Object} options
 * @return {Cursor}
 */
Partups.guardedMetaFind = function(selector, options) {
    var selector = selector || {};
    var options = options || {};

    // We do not want to return partups that have been soft deleted
    selector.deleted_at = selector.deleted_at || { $exists: false };

    // Make sure that if the callee doesn't pass the fields
    // key used in the options parameter, we set it with
    // the _id fields, so we do not publish all fields
    // by default, which would be a security issue
    options.fields = { _id: 1 };

    // The fields that should be available on each partup
    var unguardedFields = ['privacy_type', 'archived_at'];

    unguardedFields.forEach(function(unguardedField) {
        options.fields[unguardedField] = 1;
    });

    return this.find(selector, options);
};

/**
 * Find the partups used in the discover page
 *
 * @memberOf Partups
 * @param userId
 * @param {Object} options
 * @param parameters
 * @return {Cursor}
 */
Partups.findForDiscover = function(userId, options, parameters) {
    var selector = {};

    options = options || {};
    options.limit = options.limit ? parseInt(options.limit) : undefined;
    options.skip = options.skip ? parseInt(options.skip) : 0;
    options.sort = options.sort || {};

    parameters = parameters || {};
    var sort = parameters.sort || undefined;
    var textSearch = parameters.textSearch || undefined;
    var locationId = parameters.locationId || undefined;
    var networkId = parameters.networkId || undefined;
    var language = parameters.language || undefined;

    if (sort) {
        // Sort the partups from the newest to the oldest
        if (sort === 'new') {
            options.sort['created_at'] = -1;
        }

        // Sort the partups from the most popular to the least popular
        if (sort === 'popular') {
            options.sort['popularity'] = -1;
        }
    }

    // Filter the partups on language
    if (language) {
        selector['language'] = language;
    }

    // Filter archived partups
    selector['archived_at'] = { $exists: false };

    // Filter the partups that are in a given location
    if (locationId) {
        selector['location.place_id'] = locationId;
    }

    // Filter the partups that are in a given network
    if (networkId) {
        selector['network_id'] = networkId;
    }

    // Filter the partups that match the text search
    if (textSearch) {
        Log.debug('Searching for [' + textSearch + ']');

        var textSearchSelector = { $text: { $search: textSearch } };
        var tagSelector = { tags: { $in: [textSearch] } };

        options.fields = { score: { $meta: 'textScore' } };
        options.sort['score'] = { $meta: 'textScore' };

        selector.$or = [textSearchSelector, tagSelector];
    }

    return this.guardedFind(userId, selector, options);
};

/**
 * Find the partup for an update
 *
 * @memberOf Partups
 * @param {String} userId
 * @param {Update} update
 * @return {Mongo.Cursor|Void}
 */
Partups.findForUpdate = function(userId, update) {
    if (!update.partup_id) return;
    return this.guardedFind(userId, { _id: update.partup_id }, { limit: 1 });
};

/**
 * Find the partups in a network
 *
 * @memberOf Partups
 * @param {Network} network
 * @param {Object} parameters
 * @param {Object} options
 * @param {String} loggedInUserId
 * @return {Cursor}
 */
Partups.findForNetwork = function(network, parameters, options, loggedInUserId) {
    parameters = parameters || {};
    options = options || {};
    options.sort = options.sort || {};
    var textSearch = parameters.textSearch || undefined;

    var selector = {
        network_id: network._id
    };

    options.sort['popularity'] = -1;

    if (parameters.hasOwnProperty('archived')) {
        selector.archived_at = { $exists: parameters.archived };
    }

    // Filter the partups that match the text search
    if (textSearch) {
        Log.debug('Searching for [' + textSearch + ']');

        var tagSelector = { tags: { $in: [textSearch] } };
        var slugSelector = { slug: new RegExp('.*' + textSearch.replace(/ /g, '-') + '.*', 'i') };
        var nameSelector = { name: new RegExp('.*' + textSearch + '.*', 'i') };
        var descriptionSelector = { description: new RegExp('.*' + textSearch + '.*', 'i') };

        selector.$or = [tagSelector, slugSelector, nameSelector, descriptionSelector];
    }

    return this.guardedFind(loggedInUserId, selector, options);
};

/**
 * Find the partups that a user is upper of
 *
 * @memberOf Partups
 * @param {Object} user
 * @param {Object} parameters
 * @param {Number} parameters.limit
 * @param {String} parameters.sort
 * @param {Boolean} parameters.count
 * @param {String} loggedInUserId Server side only
 * @return {Cursor}
 */
Partups.findUpperPartupsForUser = function(user, parameters, loggedInUserId) {
    parameters = parameters || {};

    var upperOf = user.upperOf || [];

    var selector = { _id: { $in: upperOf } };
    var options = {};

    if (parameters.count) {
        options.count = true;
    } else {
        options.limit = parseInt(parameters.limit);
        options.skip = parseInt(parameters.skip);
        options.sort = parameters.sort || { popularity: -1 };
    }

    if (parameters.network_id) {
        selector.network_id = parameters.network_id;
    }

    if (parameters.fields) {
        options.fields = parameters.fields;
    }

    selector.archived_at = { $exists: parameters.archived };

    return this.guardedFind(loggedInUserId, selector, options);
};

/**
 * Find the partups that a user supporter of
 *
 * @memberOf Partups
 * @param {Object} user
 * @param {Object} parameters
 * @param {Number} parameters.limit
 * @param {String} parameters.sort
 * @param {Boolean} parameters.count
 * @param {String} loggedInUserId Server side only
 * @return {Cursor}
 */
Partups.findSupporterPartupsForUser = function (user, parameters, loggedInUserId) {
	user = user || {};
	parameters = parameters || {};

	var supporterOf = user.supporterOf || [];

	var selector = { _id: { $in: supporterOf } };
	var options = {};

	if (parameters.count) {
		options.count = true;
	} else {
		options.skip = parseInt(parameters.skip);
		options.limit = parseInt(parameters.limit);
		options.sort = parameters.sort || { popularity: -1 };
	}

	if (parameters.network_id) {
		selector.network_id = parameters.network_id;
	}

	selector.archived_at = { $exists: parameters.archived };

	var result = this.guardedFind(loggedInUserId, selector, options);
	return result;
};

Partups.findPartupsIdsForUser = function (user, options, loggedInUserId) {
	user = user || {};
    options = options || {};

    let ids = [];
    const supporterOfIds = user.supporterOf || [];
    const upperOfIds = user.upperOf || [];

    if (options.supporterOnly) {
        ids = supporterOfIds;
    } else if (options.upperOnly) {
        ids = upperOfIds;
    } else {
        ids = ids.concat(supporterOfIds, upperOfIds);
    }

	var selector = { _id: { $in: ids } };

    var fields = options.fields;

	return this.guardedFind(loggedInUserId, selector, {fields});
};

Partups.findStatsForAdmin = function () {
	var partups = this.find({});
	results = {
		'total': 0,
		'open': 0,
		'private': 0,
		'networkopen': 0,
		'networkinvite': 0,
		'networkclosed': 0
	};
	partups.forEach(function (partup) {
		switch (partup.privacy_type) {
			case 1:
				results.open++;
				break;
			case 2:
				results.private++;
				break;
			case 3:
				results.networkopen++;
				break;
			case 4:
				results.networkinvite++;
				break;
			case 5:
				results.networkclosed++;
				break;

		}
		results.total++;
	});
	return results;
};

Partups.findForAdminList = function (selector, options) {
	selector = selector || {};

	var limit = options.limit;
	var page = options.page;
	return this.find(selector, {
		fields: {
			'_id': 1,
			'slug': 1,
			'name': 1,
			'description': 1,
			'creator_id': 1,
			'created_at': 1,
			'archived_at': 1,
			'network_id': 1,
			'language': 1
		},
		sort: { 'created_at': -1 },
		limit: limit,
		skip: limit * page
	});
};

Partups.findForMenu = function (userId, ids, options) {
	check(userId, String);

	const partupFields = {
		fields: {
			name: 1,
			network_id: 1,
			slug: 1,
			image: 1,
			upper_data: { $elemMatch: { _id: userId } }
		}
	};
	const partupOptions = Object.assign({}, options, partupFields);

	return this.guardedFind(userId,
		{ $and: [{ _id: { $in: ids } }, { archived_at: { $exists: false } }] },
		partupOptions);
}
