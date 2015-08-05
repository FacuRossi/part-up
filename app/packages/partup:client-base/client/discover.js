/**
 * Helper for discover page
 *
 * @class discover
 * @memberof Partup.client
 */
Partup.client.discover = {

    /**
     * Default query
     *
     * This will be used to set the default query on discover,
     * and to match against when determining whether the current query is empty.
     *
     * @memberof Partup.client.discover
     */
    DEFAULT_QUERY: {
        textSearch: undefined,
        networkId: undefined,
        locationId: undefined,
        sort: 'new'
    },

    /**
     * Default starting limit
     *
     * @memberof Partup.client.discover
     */
    STARTING_LIMIT: 32,

    /**
     * Cached values
     *
     * Which documents are being cached:
     * All documents that are being inserted in minimongo when subsribing to 'partups.by_ids'.
     * partups, partups_images, uppers, uppers_images, networks, networks_images
     *
     * Setting cached values:
     * `Partup.client.discover.cache.set(partups);`
     * You should only set the cache with sorted partups that come from an empty Discover query.
     *
     * Reading from cached values:
     * This happens in the discover-page. The sub-documents are being read in PartupTile.
     * Just like:
     *   var network_from_cache = lodash.find(Partup.client.discover.cache.networks, {_id: networkId});
     *   return network_from_cache || Networks.findOne({_id: networkId});
     *
     * @memberof Partup.client.discover
     */
    cache: {
        all_partup_ids: [],

        // Which arrays are being cached should be in sync with the 'partups.by_ids' publication
        partups: [],
        partups_images: [],
        uppers: [],
        uppers_images: [],
        networks: [],
        networks_images: [],

        // Set cache by partups
        set: function(partups) {
            var cache = Partup.client.discover.cache;

            // Cache: partups
            cache.partups = partups;

            // Cache: partups_images
            var partups_images_ids = lodash.map(partups, 'image');
            cache.partups_images = Images.find({_id: {$in: partups_images_ids}}).fetch();

            // Cache: uppers
            var uppers_ids = lodash.flatten(lodash.map(partups, 'uppers'));
            cache.uppers = Meteor.users.find({_id: {$in: uppers_ids}}).fetch();

            // Cache: uppers_images
            var uppers_images_ids = lodash.map(cache.uppers, 'profile.image');
            cache.uppers_images = Images.find({_id: {$in: uppers_images_ids}}).fetch();

            // Cache: networks
            var network_ids = lodash.map(partups, 'network_id');
            cache.networks = Networks.find({_id: {$in: network_ids}}).fetch();

            // Cache: networks_images
            var networks_images_ids = lodash.map(cache.networks, 'icon');
            cache.networks_images = Images.find({_id: {$in: networks_images_ids}}).fetch();
        }
    }
};
