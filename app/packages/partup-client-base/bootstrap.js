import { get } from 'lodash';

/**
 * This component contains all of the generic shared front-end functionality
 *
 * @module client-base
 * @name client-base
 */
Meteor.startup(function() {

    if (Meteor.autorun !== typeof 'function') {
        Meteor.autorun = Tracker.autorun;
    }

    // Disable automatic reloading
    Reload._onMigrate(function(retry) {
        Session.set('puWantsToReload', true);
        return [false];
    });
    Session.set('puWantsToReload', false);

    /*************************************************************/
    /* Connection */
    /*************************************************************/
    Status.setTemplate('noconnection');

    // Check if Safari
    var is_safari = navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') === -1;
    if (is_safari) {
        $('body').addClass('pu-safari');
    }

    // Check IE version
    window.PU_IE_VERSION = -1;
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
        if (re.exec(ua) != null) {
            window.PU_IE_VERSION = parseFloat(RegExp.$1);
        }
    }

    // var oldIE = /msie 8|msie 9|msie 10/i.test(navigator.userAgent);
    if (window.PU_IE_VERSION < 11 && window.PU_IE_VERSION > -1) {
        $('body').addClass('pu-no-pointer-events');
    }

    /*************************************************************/
    /* Current loggedin users subscription */
    /*************************************************************/
    Meteor.subscribe('users.loggedin');

    /*************************************************************/
    /* Language configuration */
    /*************************************************************/
    // sets the language of the user to user setting
    // or falls back to browser settings when user
    // logs in or out
    Meteor.autorun(function(computation) {
        if (Meteor.loggingIn()) {
            return;
        }

        const user = Meteor.user();
        let locale;

        if (user) {
            locale = lodash.get(user, 'profile.settings.locale', 'en');
        } else {
            locale = Partup.client.language.getBrowserDefaultLocale();
        }

        // make nonreactive to prevent template-rerender-flickering
        Tracker.nonreactive(function() {
            Partup.client.language.change(locale);
        });
    });

    let userHasLoggedIn = false;
    let userDidLogin = false;
    Meteor.autorun(function() {
        const user = Meteor.user();
        const loggingIn = Meteor.loggingIn();

        if (!loggingIn && userDidLogin && user && window.REACT_USER_LOGIN) {
            window.REACT_USER_LOGIN();
        } else if (!user && userHasLoggedIn && window.REACT_USER_LOGOUT) {
            window.REACT_USER_LOGOUT();
        }

        userDidLogin = loggingIn;
        userHasLoggedIn = !!user;
    });

    /*************************************************************/
    /* Router animation */
    /*************************************************************/
    var previousLayout = '';
    Router.onBeforeAction(function() {
        var yieldRegions = this.route.options.yieldRegions;
        var nextLayout = '';

        // Check current template
        if (yieldRegions && yieldRegions.hasOwnProperty('modal')) {
            nextLayout = 'modal';
        } else if (yieldRegions && yieldRegions.hasOwnProperty('app')) {
            nextLayout = 'app';
        } else if (yieldRegions && yieldRegions.hasOwnProperty('swarm')) {
            nextLayout = 'swarm';
        }

        // Check if previous layout and next layout aren't the same
        if (previousLayout === nextLayout) {
            this.next();
            return;
        }

        // Find body
        var $body = $('body');

        // Add class on start
        var start = function() {
            $body.addClass('bender-animating');
        };

        // Remove class on finish
        var done = function() {
            $body.removeClass('bender-animating');
        };

        if (nextLayout === 'modal') {
            Bender.animate('slideOverUp', start, done);
        } else if ((nextLayout === 'app' || nextLayout === 'swarm') && previousLayout === 'modal') {
            Bender.animate('slideOverUpClose', start, done);
        }

        previousLayout = nextLayout;
        this.next();
    });

    /*************************************************************/
    /* Scroll to the top on every page */
    /*************************************************************/
    Router.onAfterAction(function() {
      // TODO: figure out which pages need scrolling and only apply to those pages.
      Meteor.defer(function() {
          Partup.client.scroll.to(null, 0);
      });
    });

    /*************************************************************/
    /* Intercom configuration */
    /*************************************************************/
    IntercomSettings.userInfo = function(user, info) {
        if (user) {
          Meteor.call('users.createIntercomHash', user._id, (error, result) => {
            if (error) {
              Intercom('shutdown');
            } else if (result) {
              user.intercomHash = info.user_hash = result;

              var networks = Networks.find({
                uppers: user._id
              });
              var networksString = networks.map(function(network) {
                  return network.slug;
              }).join(',');
              info['email'] = User(user).getEmail();
              info['name'] = user.profile.name;
              info['firstname'] = user.profile.firstname;
              info['language'] = user.profile.settings.locale;
              // info['phonenumber'] = user.profile.phonenumber;
              // info['gender'] = user.profile.gender;
              info['location'] = user.profile.location ? user.profile.location.city : undefined;
              info['participation_score'] = user.participation_score;
              info['completeness'] = user.completeness;

              info['tribes'] = networksString;

              info['count_partups_partner'] = user.upperOf ? user.upperOf.length : 0;
              info['count_partups_supporter'] = user.supporterOf ? user.supporterOf.length : 0;
              info['count_partups_created'] = Partups.find({
                  creator_id: user._id
              }).count();
              info['count_tribes_joined'] = networks.count();

              Intercom('update', info);
            }
          });

          return false;
        }
    };

    /*************************************************************/
    /* Intent configuration */
    /*************************************************************/
    Intent.configure({
        debug: false,
        default_route_name: 'home'
    });

    /*************************************************************/
    /* Always clear the cached subscriptions when logging out */
    /*************************************************************/
    Partup.client.user.onAfterLogout(() => {
      if (subManager) {
        Object.keys(subManager).forEach((key) => {
          if (get(subManager, `${key}.clear`)) {
            subManager[key].clear();
          }
        })
      }
    });
});
