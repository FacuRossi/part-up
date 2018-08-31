import { authorization } from 'meteor/partup-lib';

var SeoRouter = Picker.filter(function(request, response) {
    // TODO: Add more checks to see if we should render a snippet

    var botAgents = [
        /^facebookexternalhit/i, // Facebook
        /^linkedinbot/i, // LinkedIn
        /^twitterbot/i, // Twitter
        /^slackbot-linkexpanding/i, // Slack
        /^bingbot/i // Bing
    ];

    var userAgent = request.headers['user-agent'];
    var botIsUsed = false;

    botAgents.forEach(function(botAgent) {
        if (botAgent.test(userAgent)) botIsUsed = true;
    });

    var escapedFragmentIsUsed = /_escaped_fragment_/.test(request.url);

    return escapedFragmentIsUsed || botIsUsed;
});

var renderGeneralInformation = function(request, response) {
    SSR.compileTemplate('seo_home', Assets.getText('private/templates/seo/home.html'));

    Template.seo_home.helpers({
        getHomeUrl: function() {
            return Meteor.absoluteUrl();
        },
        getImageUrl: function() {
            return Meteor.absoluteUrl() + 'images/partup-logo.png';
        }
    });

    var html = SSR.render('seo_home');

    response.setHeader('Content-Type', 'text/html');
    response.end(html);
};

/**
 * Generate a SEO Route for all the routes that are defined for the application
 */
Router.routes.forEach(function(route) {
    if (route && route.getName() !== '(.*)') {
        var path = route.path();

        if (path) {
            SeoRouter.route(path, function(params, request, response) {
                renderGeneralInformation(request, response);
            });
        }
    }
});

/**
 * SEO Route for the Partup detail page
 */
SeoRouter.route('/partups/:slug', function(params, request, response) {
    var slug = params.slug;
    var partupId = slug.split('-').pop();
    var partup = Partups.findOne(partupId);

    if (!partup) {
        response.statusCode = 404;
        return response.end();
    }

    var image = Images.findOne(partup.image);

    SSR.compileTemplate('seo_partup', Assets.getText('private/templates/seo/partup.html'));

    Template.seo_partup.helpers({
        getPartupUrl: function() {
            return Meteor.absoluteUrl() + 'partups/' + partup.slug;
        },
        getImageUrl: function() {
            if (!image) return Meteor.absoluteUrl() + 'images/partup-logo.png';

            return Partup.helpers.url.getImageUrl(image);
        }
    });

    var html = SSR.render('seo_partup', partup);

    response.setHeader('Content-Type', 'text/html');
    response.end(html);
});

/**
 * SEO Route for the Profile detail page
 */
SeoRouter.route('/profile/:id', function(params, request, response) {
    var userId = params.id;
    var user = Meteor.users.findOne(userId);

    if (!user || user.deactivatedAt || !authorization.checkCanSeeProfile(null, user)) {
        response.statusCode = 404;
        return response.end();
    }

    var image = Images.findOne(user.profile.image);

    SSR.compileTemplate('seo_profile', Assets.getText('private/templates/seo/profile.html'));

    Template.seo_profile.helpers({
        getProfileUrl: function() {
            return Meteor.absoluteUrl() + 'profile/' + user._id;
        },
        getImageUrl: function() {
            if (!image) return Meteor.absoluteUrl() + 'images/partup-logo.png';

            return Partup.helpers.url.getImageUrl(image);
        }
    });

    var html = SSR.render('seo_profile', user);

    response.setHeader('Content-Type', 'text/html');
    response.end(html);
});

/**
 * SEO Route for the Network detail page
 */
SeoRouter.route('/tribes/:slug', function(params, request, response) {
    var slug = params.slug;
    var network = Networks.findOne({slug: slug});

    if (!network) {
        response.statusCode = 404;
        return response.end();
    }

    var image = Images.findOne(network.image);

    SSR.compileTemplate('seo_network', Assets.getText('private/templates/seo/network.html'));

    Template.seo_network.helpers({
        getNetworkUrl: function() {
            return Meteor.absoluteUrl() + 'tribes/' + network.slug;
        },
        getImageUrl: function() {
            if (!image) return Meteor.absoluteUrl() + 'images/partup-logo.png';

            return Partup.helpers.url.getImageUrl(image);
        }
    });

    var html = SSR.render('seo_network', network);

    response.setHeader('Content-Type', 'text/html');
    response.end(html);
});

/**
 * SEO Route for the Swarm page
 */
SeoRouter.route('/:slug', function(params, request, response) {
    var slug = params.slug;
    var swarm = Swarms.findOne({slug: slug});

    if (!swarm) {
        response.statusCode = 404;
        return response.end();
    }

    var image = Images.findOne(swarm.image);

    SSR.compileTemplate('seo_swarm', Assets.getText('private/templates/seo/swarm.html'));

    Template.seo_swarm.helpers({
        getSwarmUrl: function() {
            return Meteor.absoluteUrl() + swarm.slug;
        },
        getImageUrl: function() {
            if (!image) return Meteor.absoluteUrl() + 'images/partup-logo.png';

            return Partup.helpers.url.getImageUrl(image);
        }
    });

    var html = SSR.render('seo_swarm', swarm);

    response.setHeader('Content-Type', 'text/html');
    response.end(html);
});

/**
 * SEO Route for the Network About page
 */
SeoRouter.route('/tribes/:slug/about', function(params, request, response) {
    var slug = params.slug;
    var network = Networks.findOne({slug: slug});

    if (!network) {
        response.statusCode = 404;
        return response.end();
    }

    var image = Images.findOne(network.image);

    SSR.compileTemplate('seo_network_about', Assets.getText('private/templates/seo/network_about.html'));

    Template.seo_network_about.helpers({
        getAboutUrl: function() {
            return Meteor.absoluteUrl() + 'tribes/' + network.slug + '/about';
        },
        getAboutTitle: function() {
            if (!network.contentblocks) return network.name;
            var contentblockId = network.contentblocks[0];
            var contentblock = ContentBlocks.findOne(contentblockId);
            if (!contentblock) return network.name;
            return contentblock.title ? contentblock.title : network.name;
        },
        getAboutDescription: function() {
            if (!network.contentblocks) return network.description;
            var contentblockId = network.contentblocks[0];
            var contentblock = ContentBlocks.findOne(contentblockId);
            if (!contentblock) return network.description;
            return contentblock.text ? contentblock.text : network.description;
        },
        getImageUrl: function() {
            if (!image) return Meteor.absoluteUrl() + 'images/partup-logo.png';

            return Partup.helpers.url.getImageUrl(image);
        }
    });

    var html = SSR.render('seo_network_about', network);

    response.setHeader('Content-Type', 'text/html');
    response.end(html);
});
