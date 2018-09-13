import { get, uniq } from 'lodash';

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

        return this.findMatchingUppers(searchOptions, tags);
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
     * @param {String} searchOptions.network // Flag to exclude uppers from network X
     * @param {String} searchOptions.invited_in_network // Flag to only search already invited users to network X
     * @param {String} searchOptions.invited_in_partup // Flag to only search already invited users to partup X
     * @param {Number} searchOptions.limit
     * @param {Number} searchOptions.skip
     * @param {[String]} tags
     * @param {[String]} excludedUppers
     * @return {[String]}
     */
    findMatchingUppers(searchOptions = {}, tags, excludedUppers) {
      let selector = {};
      let query = get(searchOptions, 'query', '');
      let results;

      const viewerId = Meteor.userId();
      const {
        invited_in_network = '',
        invited_in_partup = '',
        network,
        limit,
        skip,
      } = searchOptions;

      const excludeIds = [viewerId];

      if (Array.isArray(excludedUppers)) {
        selector['_id'] = {
          $nin: uniq(excludeIds.concat(excludedUppers)),
        }
      }

      if (query.length > 0) {
        query = mout.string.replaceAccents(query.toLowerCase());

        const criteria = [
          {'profile.normalized_name': new RegExp('.*' + query + '.*', 'i')},
          {'profile.description': new RegExp('.*' + query + '.*', 'i')},
          {'profile.tags': new RegExp('.*' + query + '.*', 'i')},
          {'profile.location.city': new RegExp('.*' + query + '.*', 'i')}
        ]

        const multipleWords = query.split(' ');
        if (multipleWords.length > 1) {
          criteria.push({
            'profile.tags': {
              $in: multipleWords,
            }
          })
        }

        selector = {
          $and: [
            selector,
            {
              $or: criteria,
            }
          ]
        }
      } else {
        selector['profile.tags'] = {
          $in: tags || [],
        }
      }

      if (invited_in_network.length > 0) {
        const networkInvited = uniq(
          Invites.find({
            network_id: invited_in_network,
            type: Invites.INVITE_TYPE_NETWORK_EXISTING_UPPER,
          }).map((x) => x.invitee_id),
        );
        selector['_id'] = {
          $in: networkInvited,
        }
      }

      if (invited_in_partup.length > 0) {
        const partupInvited = uniq(
          Invites.find({
            partup_id: invited_in_partup,
            type: Invites.INVITE_TYPE_PARTUP_EXISTING_UPPER,
          }).map((x) => x.invitee_id),
        );
        selector['_id'] = {
          $in: partupInvited,
        }
      }

      if (get(network, 'length') > 0 && network !== 'all-users') {
        let networkFilterIds = [];

        if (network === 'all') {
          const publicNetworkIds = Networks.find({
            privacy_type: Networks.NETWORK_PUBLIC,
          }, { _id: 1 }).map((x) => x._id);

          networkFilterIds = publicNetworkIds;
        } else {
          const networkBySlug = Networks.findOne({
            slug: network,
          });

          if (networkBySlug && networkBySlug.hasMember(Meteor.userId())) {
            networkFilterIds = [networkBySlug._id];
          }
        }

        selector['networks'] = {
          $in: networkFilterIds,
        }
      }

      const options = {
        limit: limit ? parseInt(limit, 10) : 10,
        skip: skip ? parseInt(skip, 10) : 0,
        sort: {
          participation_score: -1,
        },
        fields: {
          _id: 1,
        },
      };

      const fetch = () => Meteor.users.findActiveUsers(viewerId, selector, options).fetch();

      results = fetch();
      if (get(query, 'length', '') < 1 && results.length == 0) {
        delete selector['profile.tags'];
        results = fetch();
      }

      return results;
    }
};
