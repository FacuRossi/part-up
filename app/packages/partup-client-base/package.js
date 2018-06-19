Package.describe({
    name: 'partup-client-base',
    version: '0.0.1',
    summary: '',
});

Package.onUse(function(api) {
    api.use(
        [
            'ecmascript',
            'modules',
            'partup-lib',
            'momentjs:moment',
            'chrismbeckett:toastr',
            'templating',
            'tracker',
            'reactive-var',
            'reactive-dict',
        ],
        ['client']
    );

    api.addFiles(
        [
            // 'uploader/plupload/plupload.js', //For debugging purposes only!
            'uploader/pluploader.js',

            'client/base-64-polyfill.js',
            'client/url-polyfill.js',
            'client/bind-polyfill.js',
            'client/uint8array.js', // required for fileuploader
            'client/moxie.js',
            'client/requestanimationframe-polyfill.js',
            'client/console-shim.js',

            'namespace.js',
            'client/sanitize.js',
            'client/html/html.js',

            'constructors/ColumnTilesLayout.js',

            'client/Debugger.js',
            'autoform/afFieldInput.js',
            'autoform/arrayHelpers.js',
            'client/error.js',
            'client/isMobile.js',
            'client/events.js',
            'client/debug.js',
            'client/socials.js',
            'client/notify.js',
            'client/language.js',
            'client/strings.js',
            'client/clipboard.js',
            'client/forms.js',
            'client/forms-mentionsInput.js',
            'client/spinner.js',
            'client/elements.js',
            'client/emoji.js',
            'client/popup.js',
            'client/uploader.js',
            'client/focuslayer.js',
            'client/datepicker.js',
            'client/reactivedate.js',
            'client/reactiveVarHelpers.js',
            'client/grid.js',
            'client/scroll.js',
            'client/screen.js',
            'client/moment.js',
            'client/updates.js',
            'client/discover.js',
            'client/prompt.js',
            'client/window.js',
            'client/url.js',
            'client/windowtitle.js',
            'client/responsive.js',
            'client/notifications.js',
            'client/embed.js',
            'client/partuptile.js',
            'client/chatmessages.js',
            'client/chatData.js',
            'client/user.js',
            'client/browser.js',
            'client/chat.js',
            'client/sort.js',
            'client/message.js',
            'client/element.js',
            'client/columnsLayout.js',
            'client/network.js',
            'client/verySpecificHelpers.js',

            'helpers/sanitize.js',
            'helpers/log.js',
            'helpers/partupResponsive.js',
            'helpers/dateFormatters.js',
            'helpers/datepicker.js',
            'helpers/equality.js',
            'helpers/forms.js',
            'helpers/imageUrl.js',
            'helpers/loading.js',
            'helpers/Partup.js',
            'helpers/isPopupActive.js',
            'helpers/footerToggle.js',
            'helpers/newlineToBreak.js',
            'helpers/onrendered.js',
            'helpers/currentUserId.js',
            'helpers/Autolinkjs.js',
            'helpers/autolink.js',
            'helpers/mobileHelpers.js',
            'helpers/browserTest.js',
            'helpers/math.js',
            'helpers/delayed.js',
            'helpers/touch.js',
            'helpers/lineBreakToBr.js',
            'helpers/logicalOperators.js',
            'helpers/RenderBlock/RenderBlock.html',
            'helpers/RenderBlock/RenderBlock.js',
            'helpers/IE.js',
            'helpers/screenSize.js',
            'helpers/route.js',
            'helpers/userBackgroundImage.js',

            'views/CenterView.html',
            'views/dangerouslyRenderHTML/dangerouslyRenderHTML.html',
            'views/dangerouslyRenderHTML/dangerouslyRenderHTML.js',

            'components/Tag.html',
            'components/Tag.js',

            'bootstrap.js',
            'analytics.js',

            // 'client/logger/plogger.js'
        ],
        ['client']
    );

    api.export('strings');
    api.export('Pluploader');
    // api.export('plogger');
});

// Package.onTest(function (api) {
//     api.use([
//         'ecmascript',
//         'modules',
//         'chrismbeckett:toastr',
//         'tinytest',
//         'practicalmeteor:chai',
//     ]);

//     api.addFiles([
//         'client/logger/formats/no.test.js',
//         'client/logger/formats/tapi18n.test.js',
//         'client/logger/transports/console.test.js',
//         'client/logger/transports/toastr.test.js',
//         'client/logger/plogger.test.js',
//     ], ['client']);
// });
