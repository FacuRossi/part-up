/**
 * Publish multiple networks for discover
 *
 * @param {Object} parameters
 * @param {string} parameters.textSearch
 * @param {string} parameters.locationId
 * @param {string} parameters.language
 * @param {string} parameters.sort
 * @param {number} parameters.limit
 * @param {number} parameters.skip
 */
Meteor.routeComposite('/networks/discover', function(request, parameters) {
    check(parameters.query, {
        textSearch: Match.Optional(String),
        locationId: Match.Optional(String),
        language: Match.Optional(String),
        type: Match.Optional(String),
        sector_id: Match.Optional(String),
        sort: Match.Optional(String),
        limit: Match.Optional(String),
        skip: Match.Optional(String),
        userId: Match.Optional(String)
    });

    parameters = {
        textSearch: parameters.query.textSearch,
        locationId: parameters.query.locationId,
        language: (parameters.query.language === 'all') ? undefined : parameters.query.language,
        type: parameters.query.type,
        sector_id: parameters.query.sector_id,
        sort: parameters.query.sort,
        limit: parameters.query.limit,
        skip: parameters.query.skip,
        notArchived: true
    };

    var options = {};

    if (parameters.limit) options.limit = parseInt(parameters.limit);
    if (parameters.skip) options.skip = parseInt(parameters.skip);

    return {
        find: function() {
            return Networks.findForDiscover(this.userId, options, parameters);
        },
        children: [
            { find: Images.findForNetwork },
            {
                find(network) {
                  return Meteor.users.findUppersForNetworkDiscover(this.userId, network);
                },
                children: [
                    { find: Images.findForUser }
                ]
            }
        ]
    };
});

/**
 * Publish a list of networks
 */
Meteor.publishComposite('networks.list', function() {
    this.unblock();

    return {
        find: function() {
            return Networks.guardedFind(this.userId);
        },
        children: [
            { find: Images.findForNetwork }
        ]
    };
});

/**
 * Publish a list of open-for-user-networks ordered by upper_count
 */
Meteor.publishComposite('networks.discoverfilter', function(urlParams, parameters, user) {
    if (this.unblock) this.unblock();

    var userId = user ? user._id : this.userId;

    return {
        find: function() {
            return Networks.findForDiscoverFilter(userId);
        },
        children: [
            { find: Images.findForNetwork }
        ]
    };
}, {
    url: 'networks-discoverfilter',
    getArgsFromRequest: function(request) {
        return [request.params, request.query, request.user];
    }
});

/**
 * Publish a network
 *
 * @param {String} networkSlug
 */
Meteor.publishComposite('networks.one', function(networkSlug) {
    if (!networkSlug) {
      return;
    }

    check(networkSlug, String);

    if (this.unblock) this.unblock();

    return {
        find: function() {
            return Networks.guardedMetaFind({ slug: networkSlug }, { limit: 1 });
        },
        children: [
            { find: Images.findForNetwork },
            { find: Invites.findForNetwork },
            {
                find: function() {
                    return Networks.guardedFind(this.userId, { slug: networkSlug }, { limit: 1 });
                }
            }
        ]
    };
});

/**
 * Publish all partups in a network
 *
 * @param {Object} urlParams
 * @param {Object} parameters
 */
Meteor.publishComposite('networks.one.partups', function(urlParams, parameters) {
    if (this.unblock) this.unblock();

    check(urlParams, {
        slug: Match.Optional(String)
    });

    parameters = parameters || {};
    if (parameters.limit) parameters.limit = parseInt(parameters.limit);
    if (parameters.skip) parameters.skip = parseInt(parameters.skip);

    check(parameters, {
        limit: Match.Optional(Number),
        skip: Match.Optional(Number),
        userId: Match.Optional(String),
        archived: Match.Optional(String),
        textSearch: Match.Optional(String)
    });

    const userId = this.userId || parameters && parameters.userId;

    const options = {};
    if (parameters.limit) options.limit = parameters.limit;
    if (parameters.skip) options.skip = parameters.skip;

    const selector = {
        archived: (parameters.archived) ? JSON.parse(parameters.archived) : false,
        textSearch: (parameters.textSearch) ? parameters.textSearch : undefined
    };

    return {
        find: () => Networks.guardedFind(userId, { slug: urlParams.slug }),
        children: [{
            find: (network) => Partups.findForNetwork(network, selector, options, userId),
            children: [
                { find: Images.findForPartup },
                {
                    find: Meteor.users.findUppersForPartup,
                    children: [
                        { find: Images.findForUser }
                    ]
                },
                {
                    find: (partup) => Networks.findForPartup(partup, userId),
                    children: [
                        { find: Images.findForNetwork }
                    ]
                }
            ]
        }],
    };
}, {
    url: 'networks/:slug/partups',
    getArgsFromRequest: function(request) {
        return [request.params, request.query];
    }
});

/**
 * Publish all uppers in a network
 *
 * @param {Object} urlParams
 * @param {Object} parameters
 */
Meteor.publishComposite('networks.one.uppers', function(urlParams, parameters) {
    if (this.unblock) this.unblock();

    check(urlParams, {
        slug: Match.Optional(String)
    });

    parameters = parameters || {};
    if (parameters.limit) parameters.limit = parseInt(parameters.limit);
    if (parameters.skip) parameters.skip = parseInt(parameters.skip);

    check(parameters, {
        limit: Match.Optional(Number),
        skip: Match.Optional(Number),
        userId: Match.Optional(String),
        textSearch: Match.Optional(String)
    });

    var options = {};
    if (parameters.limit) options.limit = parameters.limit;
    if (parameters.skip) options.skip = parameters.skip;

    var network = Networks.guardedFind(this.userId, { slug: urlParams.slug }).fetch().pop();
    if (!network) return;

    return {
        find: function() {

            if (network.isNetworkAdmin(this.userId)) {
                parameters.isAdminOfNetwork = true;
            }

            return Meteor.users.findUppersForNetwork(this.userId, network, options);
        },
        children: [
            { find: Images.findForUser }
        ]
    };
}, {
    url: 'networks/:slug/uppers',
    getArgsFromRequest: function(request) {
        return [request.params, request.query];
    }
});

/**
 * Publish all pending uppers in a network
 *
 * @param {String} networkSlug
 */
Meteor.publishComposite('networks.one.pending_uppers', function(networkSlug) {
    this.unblock();

    return {
        find: function() {
            var network = Networks.guardedFind(this.userId, { slug: networkSlug }).fetch().pop();
            if (!network) return;

            var pending_uppers = network.pending_uppers || [];
            var users = Meteor.users.findMultiplePublicProfiles(pending_uppers);

            return users;
        },
        children: [
            { find: Images.findForUser }
        ]
    };
});

/**
 * Publish the network chat
 *
 * @param {String} networkSlug
 */
Meteor.publishComposite('networks.one.chat', function(networkSlug, parameters) {
    if (this.unblock) this.unblock();

    check(networkSlug, String);

    parameters = parameters || {};
    if (parameters.limit) parameters.limit = parseInt(parameters.limit);
    if (parameters.skip) parameters.skip = parseInt(parameters.skip);

    check(parameters, {
        limit: Match.Optional(Number),
        skip: Match.Optional(Number)
    });

    var options = {};
    if (parameters.limit) options.limit = parameters.limit;
    if (parameters.skip) options.skip = parameters.skip;
    options.sort = { created_at: -1 };

    options.fields = {
        _id: 1,
        chat_id: 1,
        content: 1,
        created_at: 1,
        creator_id: 1,
        preview_data: 1
    };

    return {
        find: function() {
            return Networks.guardedFind(this.userId, { slug: networkSlug }, { limit: 1 });
        },
        children: [{
            find: function(network) {
                if (!network.chat_id) return;
                return Chats.find({ _id: network.chat_id });
            },
            children: [{
                find: function(chat) {
                    return ChatMessages.find({ chat_id: chat._id }, options);
                }
            }]
        }, {
            find: function(network) {
                return Meteor.users.findUppersForNetwork(this.userId, network);
            },
            children: [{
                find: Images.findForUser
            }]
        }]
    };
});

Meteor.publishComposite('networks.one.chat.for_web', function(networkSlug, parameters) {
    if (this.unblock) this.unblock();

    check(networkSlug, String);

    parameters = parameters || {};
    if (parameters.limit) parameters.limit = parseInt(parameters.limit);
    if (parameters.skip) parameters.skip = parseInt(parameters.skip);

    check(parameters, {
        limit: Match.Optional(Number),
        skip: Match.Optional(Number)
    });

    var options = {};
    if (parameters.limit) options.limit = parameters.limit;
    if (parameters.skip) options.skip = parameters.skip;
    options.sort = { created_at: -1 };

    options.fields = {
        _id: 1,
        chat_id: 1,
        content: 1,
        created_at: 1,
        creator_id: 1,
        preview_data: 1
    };
    var networkCursor = Networks.guardedFind(this.userId,
        { slug: networkSlug },
        {
            limit: 1,
            fields: {
                uppers: 1,
                chat_id: 1,
            }
        });
    var uppersCursor = Meteor.users.findUppersForNetwork(networkCursor.fetch().pop(), {
        fields: {
            status: 1,
            'profile.name': 1,
            'profile.image': 1,
            networks: 1,
        }
    }, {});
    var imagesCursor = Images.findForCursors([{
        imageKey: 'profile.image',
        cursor: uppersCursor,
    }], {
        fields: {
            'copies.80x80': 1,
        }
    })
    return {
        find: function() {
            return networkCursor
        },
        children: [{
            find: function(network) {
                if (!network.chat_id) return;
                return Chats.find({ _id: network.chat_id });
            },
            children: [{
                find: function(chat, network) {
                    return ChatMessages.find({ chat_id: chat._id }, options);
                }
            }]
        }, {
            find: function(network) {
                return uppersCursor
            }
        }, {
            find:  function(network) {
                return imagesCursor;
            }
        }]
    };
});

/**
 * Publish all networks for admin panel
 */
Meteor.publishComposite('networks.admin_all', function() {
    this.unblock();

    var user = Meteor.users.findOne(this.userId);
    if (!User(user).isAdmin()) return;

    return {
        find: function() {
            return Networks.find({});
        },
        children: [
            { find: Images.findForNetwork },
            {
                find: function(network) {
                    return Meteor.users.findMultiplePublicProfiles(network.admins);
                },
                children: [
                    { find: Images.findForUser }
                ]
            }
        ]
    };
});

/**
 * Publish a network
 *
 * @param {String} networkSlug
 */
Meteor.publishComposite('networks.admin_one', function(networkId) {
    check(networkId, String);

    if (this.unblock) this.unblock();

    var user = Meteor.users.findOne(this.userId);
    if (!User(user).isAdmin()) return;

    return {
        find: function() {
            return Networks.guardedMetaFind({ _id: networkId }, { limit: 1 });
        },
        children: [
            { find: Images.findForNetwork },
            { find: Invites.findForNetwork },
            {
                find: function() {
                    return Networks.find({ _id: networkId }, { limit: 1 });
                }
            }
        ]
    };
});
