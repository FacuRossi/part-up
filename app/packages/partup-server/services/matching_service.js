/**
 @namespace Partup server matching service
 @name Partup.server.services.matching
 @memberof Partup.server.services
 */
Partup.server.services.matching = {
    /**
     * Match uppers for a given activity
     *
     * @param {String} activityId
     * @param {Object} searchOptions
     * @param {String} searchOptions.query
     * @param {String} searchOptions.network
     * @param {Number} searchOptions.limit
     * @param {Number} searchOptions.skip
     *
     * @return {[String]}
     */
    matchUppersForActivity: function(activityId, searchOptions) {
        var activity = Activities.findOneOrFail(activityId);
        var partup = Partups.findOneOrFail(activity.partup_id);
        var tags = partup.tags || [];
        var uppers = partup.uppers || [];

        return this.findMatchingUppers(searchOptions, tags, uppers);
    },

    /**
     * Match uppers for a given network
     *
     * @param {String} networkSlug
     * @param {Object} searchOptions
     * @param {String} searchOptions.query
     * @param {String} searchOptions.invited_in_network
     * @param {Number} searchOptions.limit
     * @param {Number} searchOptions.skip
     *
     * @return {[String]}
     */
    matchUppersForNetwork: function(networkSlug, searchOptions) {
        var network = Networks.findOneOrFail({slug: networkSlug});
        var tags = network.tags || [];
        var uppers = network.uppers || [];

        return this.findMatchingUppers(searchOptions, tags, uppers);
    },

    /**
     * Match uppers for a given partup
     *
     * @param {String} partupId
     * @param {Object} searchOptions
     * @param {String} searchOptions.query
     * @param {String} searchOptions.network
     * @param {String} searchOptions.invited_in_partup
     * @param {Number} searchOptions.limit
     * @param {Number} searchOptions.skip
     *
     * @return {[String]}
     */
    matchUppersForPartup: function(partupId, searchOptions) {
        var partup = Partups.findOneOrFail(partupId);
        var tags = partup.tags || [];
        var uppers = partup.uppers || [];
        var supporters = partup.supporters || [];

        return this.findMatchingUppers(searchOptions, tags, uppers.concat(supporters));
    },

    /**
     * Find uppers that match with the provided criteria
     *
     * @param {Object} searchOptions
     * @param {String} searchOptions.query
     * @param {String} searchOptions.network
     * @param {String} searchOptions.invited_in_network
     * @param {String} searchOptions.invited_in_partup
     * @param {Number} searchOptions.limit
     * @param {Number} searchOptions.skip
     * @param {[String]} tags
     * @param {[String]} excludedUppers
     * @return {[String]}
     */
    findMatchingUppers: function(searchOptions, tags, excludedUppers) {
        var selector = {};
        // Exclude the current logged in user from the results
        selector['_id'] = {$nin: [Meteor.userId()]};

        if (searchOptions.query !== '') {
            // Remove accents that might have been added to the query
            var searchQuery = mout.string.replaceAccents(searchOptions.query.toLowerCase());

            // Set the search criteria
            var searchCriteria = [
                {'profile.normalized_name': new RegExp('.*' + searchQuery + '.*', 'i')},
                {'profile.description': new RegExp('.*' + searchQuery + '.*', 'i')},
                {'profile.tags': new RegExp('.*' + searchQuery + '.*', 'i')},
                {'profile.location.city': new RegExp('.*' + searchQuery + '.*', 'i')}
            ];

            // search for separate tags if multiple words are detected in searchQuery
            var multipleWordsQuery = searchQuery.split(' ');
            if (multipleWordsQuery.length > 1) {
                searchCriteria.push({'profile.tags': {$in: multipleWordsQuery}});
            }

            // Combine it in an $or selector
            selector = {$and: [selector, {$or: searchCriteria}]};
        } else {
            // No search query is provided, so match the uppers on the provided tags
            tags = tags || [];
            selector['profile.tags'] = {$in: tags};

            // Exclude provided uppers from result
            excludedUppers = excludedUppers || [];
            selector['_id'] = {$nin: excludedUppers};
        }

        // Apply invited filter for network
        if (searchOptions.invited_in_network) {
            var network_invited = lodash.unique(Invites.find({
                type: Invites.INVITE_TYPE_NETWORK_EXISTING_UPPER,
                network_id: searchOptions.invited_in_network
            }).map(function(invited) {
                return invited.invitee_id;
            }));
            selector['_id'] = {$in: network_invited};
        }

        // Apply invited filter for partup
        if (searchOptions.invited_in_partup) {
            var invited = lodash.unique(Invites.find({
                type: Invites.INVITE_TYPE_PARTUP_EXISTING_UPPER,
                partup_id: searchOptions.invited_in_partup
            }).map(function(invited) {
                return invited.invitee_id;
            }));
            selector['_id'] = {$in: invited};
        }

        // Apply networks filter
        if (searchOptions.network == 'all') {
            // Get IDs of all public networks
            var networkIds = Networks.find({privacy_type: Networks.NETWORK_PUBLIC}, {_id: 1}).map(function(network) {
                return network._id;
            });
            selector['networks'] = {$in: networkIds};
        } else if (searchOptions.network == 'all-users') {
            // No network ID needed
        } else if (searchOptions.network != '') {
            var network = Networks.findOne({slug: searchOptions.network});
            if (network && network.hasMember(Meteor.userId())) {
                selector['networks'] = {$in: [network._id]};
            }
        }

        // Set options
        var options = {
            limit: searchOptions.limit ? parseInt(searchOptions.limit) : 10,
            skip: searchOptions.skip ? parseInt(searchOptions.skip) : 0,
            sort: {participation_score: -1}, // Sort the uppers on participation_score
            fields: {_id: 1} // Only return the IDs
        };

        var results = Meteor.users.findActiveUsers(selector, options).fetch();

        // If there are no results, we remove some matching steps (only when no search options were provided)
        if (!searchOptions.query && results.length === 0) {
            delete selector['profile.tags'];
            results = Meteor.users.findActiveUsers(selector, options).fetch();
        }

        return results;
    }
};
