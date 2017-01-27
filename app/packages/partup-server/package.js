Package.describe({
    name: 'partup-server',
    version: '0.0.1',
    summary: '',
    git: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use('check');

    api.use([
        'accounts-base',
        'stevezhu:lodash',
        'email',
        'http',
        'iron:router',
        'mongo',
        'partup-lib',
        'percolate:synced-cron',
        'reywood-publish-composite',
        'service-configuration',
        'percolate:migrations',
        'tap:i18n',
        'lifely:mout',
        'meteorhacks:picker',
        'meteorhacks:ssr',
        'dsyko:meteor-node-csv',
        'random',
        'peerlibrary:aws-sdk',
        'simple:rest',
        'simple:json-routes',
        'anonyfox:scrape',
        '3stack:accounts-logout-hook'
    ], ['server']);

    api.addFiles([
        'private/emails/header.en.html',
        'private/emails/header.nl.html',
        'private/emails/footer.en.html',
        'private/emails/footer.nl.html',
        'private/emails/reset_password.en.html',
        'private/emails/reset_password.nl.html',
        'private/emails/verify_account.en.html',
        'private/emails/verify_account.nl.html',
        'private/emails/invite_upper_to_partup.en.html',
        'private/emails/invite_upper_to_partup.nl.html',
        'private/emails/invite_upper_to_partup_activity.en.html',
        'private/emails/invite_upper_to_partup_activity.nl.html',
        'private/emails/invite_email_address_to_partup.en.html',
        'private/emails/invite_email_address_to_partup.nl.html',
        'private/emails/invite_email_address_to_partup_activity.en.html',
        'private/emails/invite_email_address_to_partup_activity.nl.html',
        'private/emails/invite_upper_to_network.en.html',
        'private/emails/invite_upper_to_network.nl.html',
        'private/emails/invite_email_address_to_network.en.html',
        'private/emails/invite_email_address_to_network.nl.html',
        'private/emails/dailydigest.en.html',
        'private/emails/dailydigest.nl.html',
        'private/emails/custom.en.html',
        'private/emails/custom.nl.html',
        'private/emails/upper_mentioned_in_partup.en.html',
        'private/emails/upper_mentioned_in_partup.nl.html',
        'private/emails/upper_mentioned_in_network_chat.en.html',
        'private/emails/upper_mentioned_in_network_chat.nl.html',
        'private/emails/partup_created_in_network.en.html',
        'private/emails/partup_created_in_network.nl.html',
        'private/emails/partups_partner_request.en.html',
        'private/emails/partups_partner_request.nl.html',
        'private/emails/partups_networks_new_pending_upper.en.html',
        'private/emails/partups_networks_new_pending_upper.nl.html',
        'private/emails/partups_networks_accepted.en.html',
        'private/emails/partups_networks_accepted.nl.html',
        'private/emails/partups_new_comment_in_involved_conversation.en.html',
        'private/emails/partups_new_comment_in_involved_conversation.nl.html',
        'private/emails/partups_networks_new_upper.en.html',
        'private/emails/partups_networks_new_upper.nl.html',
        'private/emails/partups_networks_upper_left.en.html',
        'private/emails/partups_networks_upper_left.nl.html',
        'private/templates/seo/partup.html',
        'private/templates/seo/profile.html',
        'private/templates/seo/network.html',
        'private/templates/seo/network_about.html',
        'private/templates/seo/swarm.html',
        'private/templates/seo/home.html'
    ], ['server'], {isAsset: true});

    api.addFiles([
        'logger.js',
        'namespace.js',
        'constants.js',
        'bootstrap.js',
        'routes/composite.js',
        'compile_email_templates.js',
        'accounts.js',
        'accounts_email_configuration.js',
        'helpers/collection.js',
        'event.js',
        'collection_hooks.js',
        'factories/updates_factory.js',
        'services/cache_service.js',
        'services/email_service.js',
        'services/google_service.js',
        'services/images_service.js',
        'services/language_service.js',
        'services/locale_service.js',
        'services/matching_service.js',
        'services/meurs_service.js',
        'services/network_popularity_calculator_service.js',
        'services/networks_service.js',
        'services/notifications_service.js',
        'services/participation_calculator_service.js',
        'services/partup_popularity_calculator_service.js',
        'services/partup_progress_calculator_service.js',
        'services/profile_completeness_service.js',
        'services/pushnotifications_service.js',
        'services/scrape_service.js',
        'services/shared_count_service.js',
        'services/slugify_service.js',
        'services/swarms_service.js',
        'services/system_messages_service.js',
        'seo/routes.js',
        'event_handlers/any_handler.js',
        'event_handlers/partups/partups_handler.js',
        'event_handlers/partups/partups_supporters_handler.js',
        'event_handlers/partups/partups_uppers_handler.js',
        'event_handlers/partups/partups_invited_handler.js',
        'event_handlers/partups/partups_name_changed_handler.js',
        'event_handlers/partups/partups_description_changed_handler.js',
        'event_handlers/partups/partups_budget_changed_handler.js',
        'event_handlers/partups/partups_location_changed_handler.js',
        'event_handlers/partups/partups_tags_changed_handler.js',
        'event_handlers/partups/partups_end_date_changed_handler.js',
        'event_handlers/partups/partups_image_changed_handler.js',
        'event_handlers/partups/partups_language_handler.js',
        'event_handlers/users/users_settings_handler.js',
        'event_handlers/activities/activities_handler.js',
        'event_handlers/contributions/contributions_handler.js',
        'event_handlers/ratings/ratings_handler.js',
        'event_handlers/updates/updates_handler.js',
        'event_handlers/updates/updates_comments_handler.js',
        'event_handlers/updates/updates_messages_handler.js',
        'event_handlers/networks/networks_handler.js',
        'event_handlers/invites/activities_invites_handler.js',
        'event_handlers/invites/networks_invites_handler.js',
        'event_handlers/notifications/notifications_handler.js',
        'event_handlers/swarms/swarms_handler.js',
        'event_handlers/chats/chatmessages_handler.js',
        'fixtures/users.js',
        'fixtures/partups.js',
        'fixtures/updates.js',
        'fixtures/activities.js',
        'fixtures/contributions.js',
        'fixtures/ratings.js',
        'fixtures/tags.js',
        'fixtures/notifications.js',
        'fixtures/networks.js',
        'fixtures/invites.js',
        'fixtures/images.js',
        'fixtures/chats.js',
        'fixtures/chatmessages.js',
        'fixtures/tiles.js',
        'publications/activities.js',
        'publications/partups.js',
        'publications/images.js',
        'publications/updates.js',
        'publications/users.js',
        'publications/networks.js',
        'publications/languages.js',
        'publications/tiles.js',
        'publications/notifications.js',
        'publications/swarms.js',
        'publications/contentblocks.js',
        'publications/chats.js',
        'publications/sectors.js',
        'publications/boards.js',
        'routes/hooks.js',
        'routes/middleware.js',
        'routes/csv/csv_routes.js',
        'routes/images/images_routes.js',
        'routes/partups/partups_routes.js',
        'routes/networks/networks_routes.js',
        'routes/users/users_routes.js',
        'methods/updates/updates_comments_methods.js',
        'methods/updates/updates_messages_methods.js',
        'methods/activities/activities_methods.js',
        'methods/contributions/contributions_methods.js',
        'methods/ratings/ratings_methods.js',
        'methods/partups/partups_methods.js',
        'methods/partups/partups_analytics_methods.js',
        'methods/partups/partups_supporters_methods.js',
        'methods/users/users_methods.js',
        'methods/services/flickr_methods.js',
        'methods/services/splashbase_methods.js',
        'methods/services/google_methods.js',
        'methods/services/meurs_methods.js',
        'methods/settings/settings_methods.js',
        'methods/images/images_methods.js',
        'methods/networks/networks_methods.js',
        'methods/tags/tags_methods.js',
        'methods/notifications/notifications_methods.js',
        'methods/uploads/uploads_methods.js',
        'methods/tiles/tiles_methods.js',
        'methods/swarms/swarms_methods.js',
        'methods/contentblocks/contentblocks_methods.js',
        'methods/chats/chats_methods.js',
        'methods/chatmessages/chatmessages_methods.js',
        'methods/sectors/sectors_methods.js',
        'methods/boards/boards_methods.js',
        'methods/lanes/lanes_methods.js',
        'cron/reset_clicks_per_hour.js',
        'cron/calculate_partup_participation_score_for_users.js',
        'cron/calculate_partup_progress_score_for_partups.js',
        'cron/send_daily_digest_users.js',
        'cron/update_shared_count.js',
        'cron/calculate_partup_popularity_score_for_partups.js',
        'cron/calculate_partup_popularity_score_for_networks.js',
        'cron/update_swarm_shared_count.js',
        'cron/update_swarm_network_stats.js',
        'cron/calculate_active_network_uppers_partups.js',
        'cron/get_common_network_tags.js',
        'cron/set_network_updated_at.js',
        'migrations.js',
        'package-tap.i18n'
    ], ['server']);

    api.export('Log', ['server']);
});

Npm.depends({
    'busboy': '0.2.11',
    'colors': '1.0.3',
    'country-language': '0.1.7',
    'debug': '2.2.0',
    'deeper': '1.0.2',
    'eventemitter2': '0.4.14',
    'node-flickr': '0.0.3',
    'pluralize': '1.1.2',
    'slug': '0.9.1',
    'winston': '0.9.0',
    'gm': '1.20.0',
    'apn': '1.7.5',
    'moment': '2.13.0',
    'node-metainspector': '1.3.0',
    'part-up-js-models': 'git://github.com/part-up/js-models.git#1.1.3',
    'pkginfo': '0.4.0',
    'cycle': '1.0.3',
    'stack-trace': '0.0.9'
});
