var SECOND_TRACKER_NAME = 'newPartupAnalyticsTracker';
var second_tracker_id = get(Meteor, 'settings.public.secondGATracker');
var _ = require('lodash');

Meteor.startup(function() {

    // Set up second tracker if set
    if (second_tracker_id) {
        analytics.ready(function() {

          // Create 2nd tracker
          var createOptions = {'name': SECOND_TRACKER_NAME};
          if (Meteor.settings.public.development) {
              createOptions.cookieDomain = 'none';
          }
          if (_) {
            _.defer(() => {
              ga('create', second_tracker_id, createOptions);

              // Pass initial page event to 2nd tracker
              ga(SECOND_TRACKER_NAME + '.send', 'pageview', Router.current().route.path());
            });
          }
        });

        // Pass page events to 2nd tracker
        analytics.on('page', function(event, properties, options) {
            ga(SECOND_TRACKER_NAME + '.send', 'pageview', properties);
        });
    }

    analytics.on('track', function(event, properties, options) {
        if (!properties) return;
        // Pass track events to 2nd tracker
        if (second_tracker_id) {
            ga(SECOND_TRACKER_NAME + '.send', {
                hitType: 'event',
                eventCategory: properties.category || 'All',
                eventAction: event,
                eventLabel: properties.label || 'All'
            });
        }

        // Pass track events to Intercom
        if (Intercom && Intercom.public_api && Intercom.public_api.trackEvent) {
            Intercom.public_api.trackEvent(event, properties);
        }

    });
});
