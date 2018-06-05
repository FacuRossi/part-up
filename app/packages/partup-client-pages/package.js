Package.describe({
    name: 'partup-client-pages',
    version: '0.0.1',
    summary: 'All pages',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'meteorhacks:subs-manager'
    ], ['client', 'server']);

    api.use([
        'ecmascript',
        'templating',
        'partup-lib',
        'partup-client-forms',
        'partup-client-dropdowns',
        'reactive-dict',
        'reactive-var',
        'aldeed:autoform',
        'yogiben:autoform-tags',
        'http',
        'partup-client-files',
    ], 'client');

    var clientFiles = {
        app: [
            // App
            'app/app.html',
            'app/app.js',

            'app/404/layout.html',
            'app/404/layout.js',
            'app/404/default.html',

            'app/404/partup/partup.html',
            'app/404/partup/closed.html',
            'app/404/partup/not-allowed.html',

            'app/404/network/network.html',
            'app/404/network/settings.html',

            'app/404/profile/profile.html',
            'app/404/profile/not-allowed.html',

            'app/404/swarm/settings.html',
            // App:home
            'app/home/home.html',
            'app/home/home.js',
            'app/home/blocks/Home_Header.html',
            'app/home/blocks/Home_Header.js',
            'app/home/blocks/Home_Intro.html',
            'app/home/blocks/Home_Intro.js',
            'app/home/blocks/Home_Segments.html',
            'app/home/blocks/Home_Segments.js',
            'app/home/blocks/Home_Carousel.html',
            'app/home/blocks/Home_Carousel.js',
            'app/home/blocks/Home_Products.html',
            'app/home/blocks/Home_Form.html',
            'app/home/blocks/Home_Form.js',
            'app/home/blocks/Home_Footer.html',
            'app/home/blocks/Home_Footer.js',
            // 'app/home/partials/philosophy.html',
            // 'app/home/partials/philosophy.js',
            // 'app/home/partials/call-to-action.html',
            // 'app/home/partials/call-to-action.js',

            // App:discover
            'app/dashboard/dashboard.html',
            'app/dashboard/dashboard.js',
            'app/discover/discover.html',
            'app/discover/discover.js',
            'app/discover/tabs/discover-partups.html',
            'app/discover/tabs/discover-partups.js',
            'app/discover/tabs/discover-tribes.html',
            'app/discover/tabs/discover-tribes.js',
            'app/discover/tabs/discover-recommendations.html',
            'app/discover/tabs/discover-recommendations.js',
            'app/discover/partials/discover-tribes-filter.html',
            'app/discover/partials/discover-tribes-filter.js',
            'app/discover/partials/discover-partups-filter.html',
            'app/discover/partials/discover-partups-filter.js',
            'app/discover/partials/tribe-tile/tribe-tile.html',
            'app/discover/partials/tribe-tile/tribe-tile.js',
            'app/discover/partials/tile/tile.html',
            'app/discover/partials/tile/tile.js',
            'app/discover/partials/tile/archived.html',
            'app/discover/partials/tile/active.html',
            'app/discover/partials/tile/active.js',

            // App:network
            'app/network/network.html',
            'app/network/network.js',

            // App: network tabs
            'app/network/start.html',
            'app/network/start.js',
            'app/network/start/Start_About.html',
            'app/network/start/Start_About.js',
            'app/network/start/Start_Chat.html',
            'app/network/start/Start_Chat.js',
            'app/network/start/Start_Header.html',
            'app/network/start/Start_Header.js',
            'app/network/start/Start_MostActive.html',
            'app/network/start/Start_MostActive.js',
            'app/network/start/Start_Nav.html',
            'app/network/start/Start_Nav.js',
            'app/network/start/Start_Video.html',
            'app/network/start/Start_Video.js',
            'app/network/start/Start_JoinButton.html',
            'app/network/start/Start_JoinButton.js',

            'app/network/partials/joinbutton.html',
            'app/network/partials/joinbutton.js',
            'app/network/partials/NetworkInviteTile.html',
            'app/network/partials/NetworkInviteTile.js',
            'app/network/partials/NetworkStartPartupTile.html',
            'app/network/partials/NetworkStartPartupTile.js',
            'app/network/partials/uppers.html',
            'app/network/partials/uppers.js',
            'app/network/partials/partups.html',
            'app/network/partials/partups.js',

            'app/network/tabs/partups.html',
            'app/network/tabs/partups.js',
            'app/network/tabs/uppers.html',
            'app/network/tabs/uppers.js',
            'app/network/tabs/closed.html',
            'app/network/tabs/closed.js',
            'app/network/tabs/about.html',
            'app/network/tabs/about.js',
            'app/network/tabs/chat.html',
            'app/network/tabs/chat.js',

            // App:profile
            'app/profile/profile.html',
            'app/profile/profile.js',

            // App: profile tabs
            'app/profile/tabs/upper-partups.html',
            'app/profile/tabs/upper-partups.js',
            'app/profile/tabs/supporter-partups.html',
            'app/profile/tabs/supporter-partups.js',
            'app/profile/tabs/about.html',
            'app/profile/tabs/about.js',
            'app/profile/tabs/partners.html',
            'app/profile/tabs/partners.js',

            // App: profile tiles
            'app/profile/partials/profile/profile.html',
            'app/profile/partials/profile/profile.js',
            'app/profile/partials/profile/media.html',
            'app/profile/partials/profile/media.js',

            // App: profile meurs tiles
            'app/profile/partials/meurs/placeholder.html',
            'app/profile/partials/meurs/placeholder.js',
            'app/profile/partials/meurs/results.html',
            'app/profile/partials/meurs/results.js',

            // App: profile popups
            'app/profile/partials/popups/info.html',
            'app/profile/partials/popups/info.js',
            'app/profile/partials/popups/video.html',
            'app/profile/partials/popups/video.js',
            'app/profile/partials/popups/photo.html',
            'app/profile/partials/popups/photo.js',

            // App:partup-takepart (popup)
            'app/partup/takepart/takepart.html',
            'app/partup/takepart/takepart.js',

            // App:partup-gallery (update)
            'app/partup/gallery/gallery.html',
            'app/partup/gallery/gallery.js',

            // App:partup-document-renderer (update)
            'app/partup/document-renderer/document-renderer.html',
            'app/partup/document-renderer/document-renderer.js',

            // App:partup-updates
            'app/partup/updates/updates.html',
            'app/partup/updates/updates.js',
            'app/partup/update/update.html',
            'app/partup/update/update.js',
            'app/partup/updates/message-form/message-form.html',
            'app/partup/updates/message-form/message-form.js',

            // App:partup-start
            'app/partup/start/start.html',
            'app/partup/start/start.js',

            // App:partup-carousel
            'app/partup/carousel/carousel.html',
            'app/partup/carousel/carousel.js',

            // App:partup-activities
            'app/partup/activities/activities.html',
            'app/partup/activities/activities.js',
            'app/partup/activities/activity/activity.html',
            'app/partup/activities/activity/activity.js',
            'app/partup/activities/activity/form/placeholders.js',
            'app/partup/activities/activity/form/activity.html',
            'app/partup/activities/activity/form/activity.js',
            'app/partup/activities/activity/view/view.html',
            'app/partup/activities/activity/view/view.js',
            'app/partup/activities/newactivity-restricted/newactivity-restricted.html',
            'app/partup/activities/newactivity-restricted/newactivity-restricted.js',

            // App:partup
            'app/partup/partup.html',
            'app/partup/partup.js',
            'app/partup/partup-navigation.html',
            'app/partup/partup-navigation.js',
            'app/partup/partup-sidebar.html',
            'app/partup/partup-sidebar.js',

            // app content pages
            'app/content_pages/about/about.html',
            'app/content_pages/about/about.js',
            'app/content_pages/pricing/pricing.html',
            'app/content_pages/pricing/pricing.js',
            'app/content_pages/pricing/partials/product.html',
            'app/content_pages/pricing/partials/product.js',

            // app chat
            'app/chat/chat.html',
            'app/chat/chat.js'
        ],
        modal: [
            //no connection
            'modal/no_connection/no_connection.html',
            'modal/no_connection/no_connection.js',

            // App: profile settings modal
            'modal/profile_settings/profile_settings.html',
            'modal/profile_settings/profile_settings.js',
            'modal/profile_settings/details/details.html',
            'modal/profile_settings/details/details.js',
            'modal/profile_settings/account/account.html',
            'modal/profile_settings/account/account.js',
            'modal/profile_settings/email/email.html',
            'modal/profile_settings/email/email.js',
            'modal/profile_settings/notifications/notifications.html',
            'modal/profile_settings/notifications/notifications.js',
            'modal/profile_settings/notifications/unsubscribe_all.html',
            'modal/profile_settings/notifications/unsubscribe_all.js',
            'modal/profile_settings/notifications/unsubscribe_one.html',
            'modal/profile_settings/notifications/unsubscribe_one.js',
            'modal/profile_settings/advanced/advanced.html',
            'modal/profile_settings/advanced/advanced.js',

            // Modal
            'modal/modal.html',
            'modal/modal.js',

            // Modal:login
            'modal/login/login.html',
            'modal/login/login.js',

            // Modal:oauth
            'modal/oauth/oauth.html',
            'modal/oauth/oauth.js',

            // Modal:register
            'modal/register/register.html',
            'modal/register/register.js',
            'modal/register/signup/signup.html',
            'modal/register/signup/signup.js',
            'modal/register/details/details.html',
            'modal/register/details/details.js',

            // Modal:forgot/resetpasword
            'modal/forgotpassword/forgotpassword.html',
            'modal/forgotpassword/forgotpassword.js',
            'modal/forgotpassword/form/form.html',
            'modal/forgotpassword/form/form.js',

            'modal/resetpassword/resetpassword.html',
            'modal/resetpassword/resetpassword.js',

            // Modal:partup_settings
            'modal/partup_settings/partup_settings.html',
            'modal/partup_settings/partup_settings.js',

            // Modal:invite_to_activity
            'modal/invite_to_activity/invite_to_activity.html',
            'modal/invite_to_activity/invite_to_activity.js',

            // Modal:invite_to_activity
            'modal/invite_to_partup/invite_to_partup.html',
            'modal/invite_to_partup/invite_to_partup.js',

            // Modal:network
            'modal/network/network-invite.html',
            'modal/network/network-invite.js',

            // Modal:admin
            'modal/admin/admin.html',
            'modal/admin/admin.js',
            'modal/admin/overview/overview.html',
            'modal/admin/partups/partups.html',
            'modal/admin/createtribe/createtribe.html',
            'modal/admin/createswarm/createswarm.html',
            'modal/admin/sectors/sectors.html',

            // Modal:network_settings
            'modal/network_settings/network_settings.html',
            'modal/network_settings/network_settings.js',
            'modal/network_settings/details/details.html',
            'modal/network_settings/landing/landing.html',
            'modal/network_settings/requests/requests.html',
            'modal/network_settings/uppers/uppers.html',
            'modal/network_settings/partups/partups.html',
            'modal/network_settings/bulkinvite/bulkinvite.html',
            'modal/network_settings/about/about.html',
            'modal/network_settings/access/access.html',

            // Modal:create
            'modal/create/create.html',
            'modal/create/create.js',

            // Modal:create:details
            'modal/create/details/details.html',
            'modal/create/details/details.js',

            // Modal:create:activities
            'modal/create/activities/activities.html',
            'modal/create/activities/activities.js',
            'modal/create/activities/copy/copy.html',
            'modal/create/activities/copy/copy.js',

            // Modal:create:promote
            'modal/create/promote/promote.html',
            'modal/create/promote/promote.js',

            // Modal:swarm
            'modal/swarm/swarm_settings.html',
            'modal/swarm/swarm_settings.js',
            'modal/swarm/details/details.html',
            'modal/swarm/details/details.js',
            'modal/swarm/tribes/tribes.html',
            'modal/swarm/tribes/tribes.js',
            'modal/swarm/quotes/quotes.html',
            'modal/swarm/quotes/quotes.js',
            'modal/swarm/quotes/form/form.html',
            'modal/swarm/quotes/form/form.js',
            'modal/swarm/quotes/view/view.html',
            'modal/swarm/quotes/view/view.js',
            'modal/swarm/quotes/item/item.html',
            'modal/swarm/quotes/item/item.js'
        ],
        swarm: [
            'swarm/swarm.html',
            'swarm/swarm.js',

            'swarm/explorer/explorer.html',
            'swarm/explorer/explorer.js',
            'swarm/explorer/bubble/bubble.html',
            'swarm/explorer/bubble/bubble.js',
            'swarm/explorer/ring/ring.html',
            'swarm/explorer/ring/ring.js',

            'swarm/content/content.html',
            'swarm/content/content.js',
            'swarm/content/video/video.html',
            'swarm/content/video/video.js',
            'swarm/content/networks/networks.html',
            'swarm/content/networks/networks.js',

            'swarm/footer/footer.html',
            'swarm/footer/footer.js'
        ]
    };

    api.addFiles([].concat(
        clientFiles.app,
        clientFiles.modal,
        clientFiles.swarm), 'client');
});
