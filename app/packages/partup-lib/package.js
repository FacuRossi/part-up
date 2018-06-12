Package.describe({
    name: 'partup-lib',
    version: '0.0.1',
    summary: '',
    git: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'ecmascript',
        'stevezhu:lodash',
        'mongo',
        'tracker',
        'aldeed:simple-schema',
        'aldeed:autoform',
        'chrismbeckett:toastr',
        'momentjs:moment',
        'matb33:collection-hooks',
        'partup-client-copy-to-clipboard',
        'lifely:mout',
        'iron:router',
        'reactive-dict',
        'reactive-var',
        'http',
        'check',
    ]);

    api.use([
        'templating',
        'meteorhacks:subs-manager',
    ], 'client');

    api.addFiles([
        'namespace.js',
        'version.js',
        'globals.js',
        'routes.js',
        'services/location.js',
        'services/placeholder.js',
        'services/tags.js',
        'services/validators.js',
        'services/website.js',
        'collections/activities.js',
        'collections/invites.js',
        'collections/contributions.js',
        'collections/updates.js',
        'collections/notifications.js',
        'collections/partup_user_settings.js',
        'collections/partups.js',
        'collections/images.js',
        'collections/ratings.js',
        'collections/networks.js',
        'collections/users.js',
        'collections/tags.js',
        'collections/places.js',
        'collections/places_autocompletes.js',
        'collections/languages.js',
        'collections/tiles.js',
        'collections/swarms.js',
        'collections/contentblock.js',
        'collections/chats.js',
        'collections/chatmessages.js',
        'collections/sectors.js',
        'collections/boards.js',
        'collections/lanes.js',
        'collections/files.js',
        'schemas/activity.js',
        'schemas/update/update.js',
        'schemas/update/forms/message.js',
        'schemas/contribution.js',
        'schemas/file.js',
        'schemas/forgotPassword.js',
        'schemas/login.js',
        'schemas/network.js',
        'schemas/networkAccess.js',
        'schemas/partup.js',
        'schemas/register.js',
        'schemas/resetPassword.js',
        'schemas/settings.js',
        'schemas/tag.js',
        'schemas/inviteUpper.js',
        'schemas/rating.js',
        'schemas/networkBulkinvite.js',
        'schemas/language.js',
        'schemas/tile.js',
        'schemas/swarm.js',
        'schemas/contentblock.js',
        'schemas/chat.js',
        'schemas/chatmessage.js',
        'schemas/sector.js',
        'schemas/board.js',
        'schemas/lane.js',
        'transformers/activity.js',
        'transformers/partup.js',
        'transformers/user.js',
        'transformers/update.js',
        'transformers/contributions.js',
        'transformers/network.js',
        'transformers/networkAccess.js',
        'transformers/swarm.js',
        'transformers/contentblock.js',
        'transformers/lane.js',
        'helpers/impersonation.js',
        'helpers/parselocale.js',
        'helpers/mentions.js',
        'helpers/normalize.js',
        'helpers/interpolateEmailMessage.js',
        'helpers/url.js',
        'helpers/fileUploader.js',
        'helpers/dropboxRenderer.js',
        'helpers/googleDriveRenderer.js',
        'helpers/typeExtensions.js',
        'helpers/files/files.js',
    ]);

    api.addFiles([
      'submanager.js',
    ], ['client']);

    api.addFiles([
        'startup/default_profile_pictures.js',
        'startup/default_partup_pictures.js'
    ], ['server']);

    for (var i = 1; i <= 15; i++) {
        api.addFiles('private/default_profile_pictures/Profielfoto' + i + '.png', 'server', {isAsset: true});
    }

    for (var i = 1; i <= 12; i++) {
        api.addFiles('private/default_partup_pictures/Partupfoto' + i + '.png', 'server', {isAsset: true});
    }

    // Version
    api.export('Version');

    // Namespace
    api.export('Partup');

    // Collections
    api.export('Activity');
    api.export('Activities');
    api.export('Invites');
    api.export('Contributions');
    api.export('Images');
    api.export('Temp');
    api.export('Networks');
    api.export('Notifications');
    api.export('Partups');
    api.export('PartupUserSettings');
    api.export('Ratings');
    api.export('Tags');
    api.export('Updates');
    api.export('Update');
    api.export('User');
    api.export('Places');
    api.export('PlacesAutocompletes');
    api.export('Uploads');
    api.export('Languages');
    api.export('Tiles');
    api.export('Swarms');
    api.export('ContentBlocks');
    api.export('Chats');
    api.export('ChatMessages');
    api.export('FileUploader');
    api.export('Sectors');
    api.export('Boards');
    api.export('Lanes');
    api.export('Files');

    // Globals
    api.export('get');
    api.export('set');

    api.export('FEATURE_FLAGS');
    api.export('features');
    api.export('subManager', 'client');
});

Package.onTest(function(api) {
  api.use(['ecmascript', 'underscore', 'tinytest', 'practicalmeteor:chai']);

//   api.addFiles('helpers/fileUploader.tests.js', 'client');
  api.addFiles('helpers/files/files.test.js', 'client');

});
