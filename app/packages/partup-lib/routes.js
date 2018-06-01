import features, { FEATURE_FLAGS } from './features';

Router.isHomePage = new ReactiveVar(false);
Router.onBeforeAction(function(req, res, next) {
    Router.isHomePage.set(/^\/$/.test(req.url));
    next();
});
/**
 * This namespace contains router helpers etc
 * @namespace Router
 */
/** ***********************************************************/
/* Configurations */
/** ***********************************************************/
Router.configure({
    layoutTemplate: 'main',
    state: function() {
        return {
            type: 'default',
        };
    },
});

/** ***********************************************************/
/* Home */
/** ***********************************************************/
Router.route('', {
    name: 'home',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_home: { to: 'app' },
    },
    onBeforeAction: function() {
        Partup.client.windowTitle.setContextName('Home');
        this.next();
    },
});

/** ***********************************************************/
/* Dashboard */
/** ***********************************************************/

features.when(FEATURE_FLAGS.FEATURE_FLAG_HOME, () => {
  Router.route('/home', {
    name: 'dashboard',
    where: 'client',
    yieldRegions: {
      app: { to: 'main' },
      app_dashboard: { to: 'app' },
    },
  });
});

/** ***********************************************************/
/* Discover */
/** ***********************************************************/
Router.route('/discover', {
    name: 'discover',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_discover: { to: 'app' },
        app_discover_tribes: { to: 'app_discover' },
    },
    onBeforeAction: function() {
        Partup.client.windowTitle.setContextName('Discover');
        this.next();
    },
});

/** ***********************************************************/
/* Discover */
/** ***********************************************************/
Router.route('/discover/partups', {
    name: 'discover-partups',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_discover: { to: 'app' },
        app_discover_partups: { to: 'app_discover' },
    },
    onBeforeAction: function() {
        Partup.client.windowTitle.setContextName('Discover Partups');
        this.next();
    },
});

Router.route('/discover/recommendations', {
    name: 'discover-recommendations',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_discover: { to: 'app' },
        app_discover_recommendations: { to: 'app_discover' },
        // 'modal_recommendations': {to: 'modal'},
    },
    onBeforeAction: function() {
        Partup.client.windowTitle.setContextName('Discover Recommendations');
        this.next();
    },
});

/** ***********************************************************/
/* Profile */
/** ***********************************************************/
// this is the fallback profile route when a user changes the url to /profile without an _id
Router.route('/profile', {
    name: 'profile-fallback',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_profile: { to: 'app' },
        app_profile_about: { to: 'app_profile' },
    },
    onBeforeAction: function() {
        if (!this.params._id) {
            this.params._id = Meteor.userId();
        }
        this.next();
    },
    data: function() {
        return {
            profileId: this.params._id,
        };
    },
});

Router.route('/profile/:_id', {
    name: 'profile',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_profile: { to: 'app' },
        app_profile_about: { to: 'app_profile' },
    },
    data: function() {
        return {
            profileId: this.params._id,
            resultsReady: this.params.query.results_ready || false,
        };
    },
    onBeforeAction: function() {
        // when `?results_ready=true` this call must be made
        let resultsReady = this.params.query.results_ready || false;
        if (resultsReady) Meteor.call('meurs.get_results', this.params._id);
        this.next();
    },
});

Router.route('/profile/:_id/partner', {
    name: 'profile-upper-partups',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_profile: { to: 'app' },
        app_profile_upper_partups: { to: 'app_profile' },
    },
    data: function() {
        return {
            profileId: this.params._id,
        };
    },
});

Router.route('/profile/:_id/supporter', {
    name: 'profile-supporter-partups',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_profile: { to: 'app' },
        app_profile_supporter_partups: { to: 'app_profile' },
    },
    data: function() {
        return {
            profileId: this.params._id,
        };
    },
});

Router.route('/profile/:_id/partners', {
    name: 'profile-partners',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_profile: { to: 'app' },
        app_profile_partners: { to: 'app_profile' },
    },
    data: function() {
        return {
            profileId: this.params._id,
        };
    },
});

/** ***********************************************************/
/* Profile settings modal */
/** ***********************************************************/
Router.route('/profile/:_id/settings', {
    name: 'profile-settings',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_profile_settings: { to: 'modal' },
        modal_profile_settings_details: { to: 'modal_profile_settings' },
    },
    data: function() {
        return {
            profileId: this.params._id,
        };
    },
});

Router.route('/profile/:_id/settings/general', {
    name: 'profile-settings-account',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_profile_settings: { to: 'modal' },
        modal_profile_settings_account: { to: 'modal_profile_settings' },
    },
    data: function() {
        return {
            profileId: this.params._id,
        };
    },
});

Router.route('/profile/:_id/settings/advanced', {
    name: 'profile-settings-advanced',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_profile_settings: { to: 'modal' },
        modal_profile_settings_advanced: { to: 'modal_profile_settings' },
    },
    data: function() {
        return {
            profileId: this.params._id,
        };
    },
});

Router.route('/profile/:_id/settings/email', {
    name: 'profile-settings-email',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_profile_settings: { to: 'modal' },
        modal_profile_settings_email: { to: 'modal_profile_settings' },
    },
    data: function() {
        return {
            profileId: this.params._id,
        };
    },
});

Router.route('/profile/:_id/settings/notifications', {
    name: 'profile-settings-notifications',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_profile_settings: { to: 'modal' },
        modal_profile_settings_notifications: { to: 'modal_profile_settings' },
    },
    data: function() {
        return {
            profileId: this.params._id,
        };
    },
});

/** ***********************************************************/
/* Login flow */
/** ***********************************************************/
Router.route('/login', {
    name: 'login',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_login: { to: 'modal' },
    },
    onBeforeAction: function() {
        Partup.client.windowTitle.setContextName('Log in');
        this.next();
    },
});

/** ***********************************************************/
/* OAuth grant */
/** ***********************************************************/
Router.route('/oauth/authorize', {
    name: 'oauth',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_oauth: { to: 'modal' },
    },
    data: function() {
        let query = this.params.query;
        return {
            clientId: query.client_id,
            responseType: query.response_type,
            scope: query.scope,
            state: query.state,
        };
    },
    onBeforeAction: function() {
        Partup.client.windowTitle.setContextName('Authorize Application');
        this.next();
    },
});

/** ***********************************************************/
/* Password reset */
/** ***********************************************************/
Router.route('/forgot-password', {
    name: 'forgot-password',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_forgotpassword: { to: 'modal' },
    },
    onBeforeAction: function() {
        Partup.client.windowTitle.setContextName('Forgot password');
        this.next();
    },
});

Router.route('/reset-password/:token', {
    name: 'reset-password',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_resetpassword: { to: 'modal' },
    },
    data: function() {
        return {
            token: this.params.token,
        };
    },
});

/** ***********************************************************/
/* Verify Account */
/** ***********************************************************/
Router.route('/verify-email/:token', {
    name: 'verify-email',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
    },
    data: function() {
        return {
            token: this.params.token,
        };
    },
    onBeforeAction: function() {
        Router.go('profile-fallback');

        Accounts.verifyEmail(this.data().token, function(error) {
            if (error) {
                Partup.client.notify.warning(
                    TAPi18n.__('notification-verify-mail-warning')
                );
            } else {
                Partup.client.notify.success(
                    TAPi18n.__('notification-verify-mail-success')
                );
            }
        });
    },
});

/** ***********************************************************/
/* Unsubscribe from mailings */
/** ***********************************************************/
Router.route('/unsubscribe-email-all/:token', {
    name: 'unsubscribe-email-all',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_profile_settings_email_unsubscribe_all: { to: 'modal' },
    },
    data: function() {
        return {
            token: this.params.token,
        };
    },
});

Router.route('/unsubscribe-email-one/:subscriptionKey/:token', {
    name: 'unsubscribe-email-one',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_profile_settings_email_unsubscribe_one: { to: 'modal' },
    },
    data: function() {
        return {
            subscriptionKey: this.params.subscriptionKey,
            token: this.params.token,
        };
    },
});

/** ***********************************************************/
/* Register flow */
/** ***********************************************************/
Router.route('/register', {
    name: 'register',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_register: { to: 'modal' },
        modal_register_signup: { to: 'modal_register' },
    },
    data: function() {
        return {
            prefillEmail: this.params.query.email,
        };
    },
    onBeforeAction: function() {
        Partup.client.windowTitle.setContextName('Register');
        this.next();
    },
});

Router.route('/register/details', {
    name: 'register-details',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_register: { to: 'modal' },
        modal_register_details: { to: 'modal_register' },
    },
});

/** ***********************************************************/
/* Partup detail */
/** ***********************************************************/
Router.route('/partups/:slug', {
    name: 'partup',
    where: 'client',
    data() {
      return {
        partupId: Partup.client.strings.partupSlugToId(this.params.slug),
      }
    },
    async onRun() {
      if (!Meteor.userId()) {
        return this.redirect('partup-start', { slug: this.params.slug });
      }
      const partupId = Partup.client.strings.partupSlugToId(this.params.slug);
      const landingpage = await new Promise((resolve, reject) => {
          Meteor.call('partup_user_settings', partupId, (error, result) => {
            if (error) {
              return this.redirect('partup-start', { slug: this.params.slug });
            }
            resolve(result.landing_page);
          });
      });
      this.redirect(`/partups/${this.params.slug}/${landingpage}`);
    },
    // // Should this be set for all partup pages?
    // onBeforeAction() {
      // let partupId = this.data().partupId;
      // let accessToken = this.data().accessToken;
      // if (partupId && accessToken) {
      //     Session.set('partup_access_token', accessToken);
      //     Session.set('partup_access_token_for_partup', partupId);
      // }
    // },
});

Router.route('/partups/:slug/start', {
    name: 'partup-start',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_partup: { to: 'app' },
        app_partup_start: { to: 'app_partup' },
    },
    data: function() {
        let partupId = Partup.client.strings.partupSlugToId(this.params.slug);
        return {
          partupId,
        };
    },
});

Router.route('/partups/:slug/conversations', {
  name: 'partup-conversations',
  where: 'client',
  yieldRegions: {
      app: { to: 'main' },
      app_partup: { to: 'app' },
      app_partup_updates: { to: 'app_partup' },
  },
  data() {
    const partupId = Partup.client.strings.partupSlugToId(this.params.slug);
    return {
        partupId,
        accessToken: this.params.query.token,
        defaultFilter: 'conversations',
        renderIconText: !User(Meteor.user()).isPartnerOrSupporterInPartup(partupId),
    };
  },
  // onRun() {
  //     Meteor.call('partups.analytics.click', this.data().partupId);
  //     this.next();
  // },
});

Router.route('/partups/:slug/updates/:update_id', {
    name: 'partup-update',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_partup: { to: 'app' },
        app_partup_update: { to: 'app_partup' },
    },
    data: function() {
        return {
            partupId: Partup.client.strings.partupSlugToId(this.params.slug),
            partupSlug: this.params.slug,
            updateId: this.params.update_id,
        };
    },
});

Router.route('/partups/:slug/activities', {
    name: 'partup-activities',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_partup: { to: 'app' },
        app_partup_activities: { to: 'app_partup' },
    },
    data: function() {
        return {
            partupId: Partup.client.strings.partupSlugToId(this.params.slug),
        };
    },
});

Router.route('/partups/:slug/documents', {
    name: 'partup-documents',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_partup: { to: 'app' },
        app_partup_updates: { to: 'app_partup' },
    },
    data: function() {
        return {
            partupId: Partup.client.strings.partupSlugToId(this.params.slug),
            defaultFilter: 'documents-links',
        };
    },
});

Router.route('/partups/:slug/updates', {
    name: 'partup-updates',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_partup: { to: 'app' },
        app_partup_updates: { to: 'app_partup' },
    },
    data: function() {
        return {
            partupId: Partup.client.strings.partupSlugToId(this.params.slug),
        };
    },
});

Router.route('/partups/:slug/invite', {
    name: 'partup-invite',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_invite_to_partup: { to: 'modal' },
    },
    data: function() {
        return {
            partupId: Partup.client.strings.partupSlugToId(this.params.slug),
        };
    },
});

Router.route('/partups/:slug/invite-for-activity/:activity_id', {
    name: 'partup-activity-invite',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_invite_to_activity: { to: 'modal' },
    },
    data: function() {
        return {
            partupId: Partup.client.strings.partupSlugToId(this.params.slug),
            activityId: this.params.activity_id,
        };
    },
});

Router.route('/partups/:slug/settings', {
    name: 'partup-settings',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_partup_settings: { to: 'modal' },
    },
    data: function() {
        return {
            partupId: Partup.client.strings.partupSlugToId(this.params.slug),
        };
    },
});

/** ***********************************************************/
/* Close window route */
/** ***********************************************************/
Router.route('/close', {
    name: 'close',
    where: 'client',
    onBeforeAction: function() {
        window.close();
    },
});

/** ***********************************************************/
/* Admin (super mega ultra admin) */
/** ***********************************************************/
Router.route('/admin', {
    name: 'admin-overview',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_admin: { to: 'modal' },
        modal_admin_overview: { to: 'modal_admin' },
    },
});

Router.route('/admin/partups', {
    name: 'admin-partups',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_admin: { to: 'modal' },
        modal_admin_partups: { to: 'modal_admin' },
    },
});

Router.route('/admin/tribes', {
    name: 'admin-createtribe',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_admin: { to: 'modal' },
        modal_create_tribe: { to: 'modal_admin' },
    },
});

Router.route('/admin/swarms', {
    name: 'admin-createswarm',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_admin: { to: 'modal' },
        modal_create_swarm: { to: 'modal_admin' },
    },
});

Router.route('/admin/sectors', {
    name: 'admin-sectors',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_admin: { to: 'modal' },
        modal_sectors: { to: 'modal_admin' },
    },
});

/** ***********************************************************/
/* Content pages */
/** ***********************************************************/
Router.route('/about', {
    name: 'about',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_about: { to: 'app' },
    },
    onBeforeAction: function() {
        Partup.client.windowTitle.setContextName('About');
        this.next();
    },
});

Router.route('/pricing', {
    name: 'pricing',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_pricing: { to: 'app' },
    },
    onBeforeAction: function() {
        Partup.client.windowTitle.setContextName('Pricing');
        this.next();
    },
});

/** ***********************************************************/
/* Networks */
/** ***********************************************************/
Router.route('/tribes/:slug', {
    name: 'network',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_network_start: { to: 'app' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
            accessToken: this.params.query.token,
        };
    },
    onBeforeAction: function() {
        let route = this;
        let networkSlug = route.params.slug;
        let accessToken = route.params.query.token;
        let showStartpage = route.params.query.show;
        let userId = Meteor.userId();
        if (networkSlug && accessToken) {
            Session.set('network_access_token', accessToken);
            Session.set('network_access_token_for_network', networkSlug);
        }
        if (userId && networkSlug && accessToken) {
            Meteor.call(
                'networks.convert_access_token_to_invite',
                networkSlug,
                accessToken
            );
        }
        if (showStartpage === 'true') {
            route.next();
        } else if (showStartpage === 'false') {
            route.renderRoute('network-detail');
        } else {
            Meteor.call(
                'users.member_of_network',
                userId,
                networkSlug,
                function(error, response) {
                    var response = response || {};
                    if (response.has_member) {
                        route.renderRoute('network-detail');
                    } else {
                        route.render();
                    }
                }
            );
            route.stop();
        }
    },
});

Router.route('/tribes/:slug/partups', {
    name: 'network-detail',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_network: { to: 'app' },
        app_network_partups: { to: 'app_network' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
        };
    },
});


/** ***********************************************************/
/* Networks. Create Partup */
/** ***********************************************************/
Router.route('/tribes/:slug/partups/create/:_id/activities', {
    name: 'create-activities',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_create: { to: 'modal' },
        modal_create_activities: { to: 'modal_create' },
    },
    data: function() {
        return {
          partupId: this.params._id,
          networkSlug: this.params.slug,
        };
    },
    action: function() {
        if (Meteor.isClient) {
            Session.set(
                'partials.create-partup.current-partup',
                this.params._id
            );
        }
        this.render();
    },
});

Router.route('/tribes/:slug/partups/create/:_id/promote', {
    name: 'create-promote',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_create: { to: 'modal' },
        modal_create_promote: { to: 'modal_create' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
            partupId: this.params._id,
        };
    },
    action: function() {
        if (Meteor.isClient) {
            Session.set(
                'partials.create-partup.current-partup',
                this.params._id
            );
        }
        this.render();
    },
});

Router.route('/tribes/:slug/partups/create', {
  name: 'create-details',
  where: 'client',
  yieldRegions: {
      modal: { to: 'main' },
      modal_create: { to: 'modal' },
      modal_create_details: { to: 'modal_create' },
  },
  data: function() {
      return {
          networkSlug: this.params.slug,
      };
  },
});

Router.route('/tribes/:slug/uppers', {
    name: 'network-uppers',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_network: { to: 'app' },
        app_network_uppers: { to: 'app_network' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
        };
    },
});

Router.route('/tribes/:slug/about', {
    name: 'network-about',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_network: { to: 'app' },
        app_network_about: { to: 'app_network' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
        };
    },
});

// Temporarily disabled for mobile chat release
Router.route('/tribes/:slug/chat', {
    name: 'network-chat',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_network: { to: 'app' },
        app_network_chat: { to: 'app_network' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
        };
    },
});

Router.route('/tribes/:slug/chat#:chat_message_id', {
    name: 'network-chat-message',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_network: { to: 'app' },
        app_network_chat: { to: 'app_network' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
            chatMessageId: this.params.chat_message_id,
        };
    },
});

Router.route('/tribes/:slug/invite', {
    name: 'network-invite',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_network_invite: { to: 'modal' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
        };
    },
});

/** ***********************************************************/
/* Network (admin) */
/** ***********************************************************/
Router.route('/tribes/:slug/settings', {
    name: 'network-settings',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_network_settings: { to: 'modal' },
        modal_network_settings_details: { to: 'modal_network_settings' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
        };
    },
});

Router.route('/tribes/:slug/settings/landing', {
    name: 'network-settings-landing',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_network_settings: { to: 'modal' },
        modal_network_settings_landing: { to: 'modal_network_settings' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
        };
    },
});

Router.route('/tribes/:slug/settings/uppers', {
    name: 'network-settings-uppers',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_network_settings: { to: 'modal' },
        modal_network_settings_uppers: { to: 'modal_network_settings' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
        };
    },
});

Router.route('/tribes/:slug/settings/partups', {
    name: 'network-settings-partups',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_network_settings: { to: 'modal' },
        modal_network_settings_partups: { to: 'modal_network_settings' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
        };
    },
});

Router.route('/tribes/:slug/settings/bulk-invite', {
    name: 'network-settings-bulkinvite',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_network_settings: { to: 'modal' },
        modal_network_settings_bulkinvite: { to: 'modal_network_settings' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
        };
    },
});

Router.route('/tribes/:slug/settings/requests', {
    name: 'network-settings-requests',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_network_settings: { to: 'modal' },
        modal_network_settings_requests: { to: 'modal_network_settings' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
        };
    },
});

Router.route('/tribes/:slug/settings/about', {
    name: 'network-settings-about',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_network_settings: { to: 'modal' },
        modal_network_settings_about: { to: 'modal_network_settings' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
        };
    },
});

Router.route('/tribes/:slug/settings/access', {
    name: 'network-settings-access',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_network_settings: { to: 'modal' },
        modal_network_settings_access: { to: 'modal_network_settings' },
    },
    data: function() {
        return {
            networkSlug: this.params.slug,
        };
    },
});

/** ***********************************************************/
/* Chats */
/** ***********************************************************/

Router.route('/chats', {
    name: 'chats',
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_chat: { to: 'app' },
    },
    data: function() {
        let route = this;
        let startChatUserId = route.params.query.user_id || false;
        return {
            chatId: this.params.hash,
            startChatUserId: startChatUserId,
        };
    },
});

/** ***********************************************************/
/* Swarm */
/** ***********************************************************/

Router.route('/:slug', {
    name: 'swarm',
    where: 'client',
    yieldRegions: {
        swarm: { to: 'main' },
    },
    data: function() {
        return {
            slug: this.params.slug,
        };
    },
    onBeforeAction: function() {
        let self = this;

        // N.B. this param rewrite ensures case insensitive urls for swarms
        this.params.slug = Partup.client.strings.slugify(self.params.slug);

        let slug = this.params.slug;

        // all lowecased
        const filterSlugs = [
          'drivepicker',
        ];

        if (filterSlugs.indexOf(slug) > -1) {
          return;
        }

        // this checks if the slug is a swarm or network and handles it accordingly
        Meteor.call('swarms.slug_is_swarm_or_network', slug, function(
            error,
            result
        ) {
            var result = result || {};
            // if something goes wrong, just continue rendering
            if (error) self.render();

            // render the page if it's a swarm
            // swarm always has priority over a network
            if (result.is_swarm) {
                self.render();

                // redirect to the network detail if it isn't a swarm but is a network
            } else if (result.is_network) {
                self.redirect(
                    'network', {
                        slug: self.params.slug,
                    }, {
                        query: self.params.query,
                    }
                );

                // if it is neither a swarm or network, continue rendering the swarm page
                // the page will handle a "not found" exception by itself
            } else {
                self.render();
            }
        });

        // this prevents anything from happening
        // before the meteor call is completed
        this.stop();
    },
});

/** ***********************************************************/
/* Swarm (admin) */
/** ***********************************************************/

Router.route('/:slug/settings', {
    name: 'swarm-settings-details',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_swarm_settings: { to: 'modal' },
        modal_swarm_settings_details: { to: 'modal_swarm_settings' },
    },
    data: function() {
        return {
            slug: this.params.slug,
        };
    },
});
Router.route('/:slug/tribes', {
    name: 'swarm-settings-tribes',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_swarm_settings: { to: 'modal' },
        modal_swarm_settings_tribes: { to: 'modal_swarm_settings' },
    },
    data: function() {
        return {
            slug: this.params.slug,
        };
    },
});
Router.route('/:slug/quotes', {
    name: 'swarm-settings-quotes',
    where: 'client',
    yieldRegions: {
        modal: { to: 'main' },
        modal_swarm_settings: { to: 'modal' },
        modal_swarm_settings_quotes: { to: 'modal_swarm_settings' },
    },
    data: function() {
        return {
            slug: this.params.slug,
        };
    },
});

/** ***********************************************************/
/* All other routes */
/** ***********************************************************/
Router.route('/(.*)', {
    where: 'client',
    yieldRegions: {
        app: { to: 'main' },
        app_notfound: { to: 'app' },
    },
    action: function() {
        Partup.client.windowTitle.setContextName('404 Not found');
    },
});

/** ***********************************************************/
/* Route protection */
/** ***********************************************************/

// Shield pages for non-users
Router.onBeforeAction(
    function(req, res, next) {
        if (!Meteor.userId()) {
            Intent.go({ route: 'login' }, function(user) {
                if (user) next();
                else this.back();
            });
        } else {
            next();
        }
    }, {
        where: 'client',
        only: [
            'create',
            'create-details',
            'create-activities',
            'create-promote',
            'register-details',
            'network-invite',
            'oauth',
            'profile-settings',
            'profile-settings-account',
            'profile-settings-email',
            'partup-settings',
            'admin-overview',
            'admin-featured-partups',
            'admin-createtribe',
            'network-settings',
            'network-settings-uppers',
            'network-settings-requests',
            'network-settings-bulkinvite',
        ],
    }
);

// Shield admin pages for non admins
Router.onBeforeAction(
    function(req, res, next) {
        let user = Meteor.user();
        if (User(user).isAdmin()) {
            next();
        } else {
            Router.pageNotFound();
        }
    }, {
        where: 'client',
        only: ['admin-overview', 'admin-featured-partups', 'admin-createtribe'],
    }
);

// Reset create-partup id to reset the create partup flow
Router.onBeforeAction(
    function(req, res, next) {
        if (Meteor.isClient) {
            Session.set('partials.create-partup.current-partup', undefined);
        }
        next();
    }, {
        where: 'client',
        except: [
            'create-details',
            'create-activities',
            'create-contribute',
            'create-promote',
        ],
    }
);

/** ***********************************************************/
/* Miscellaneous */
/** ***********************************************************/
if (Meteor.isClient) {
    Router.onBeforeAction(function() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Disable focuslayer (a white layer currently used with edit-activity in the start-partup-flow)
        Partup.client.focuslayer.disable();

        // Close any popups
        try {
            Partup.client.popup.close();
        } catch (err) {}

        // Proceed route change
        this.next();
    });

    /**
     * Router helper for ernot foundror pages
     *
     * @memberOf Router
     * @param {String} type          Type of 404 page (partup/network/default)
     *
     */
    Router.pageNotFound = function(type, data) {
        let currentRoute = this.current();
        if (type) currentRoute.state.set('type', type);
        if (data) currentRoute.state.set('data', data);
        currentRoute.render('app', { to: 'main' }); // this is so it also works for modals
        currentRoute.render('app_notfound', { to: 'app' });
    };

    // renders the yield regions of a different route
    // basically a redirect without the redirect
    // users can still use the browser "back" button
    // WARNING: this should only be used to render child routes
    // for example: /tribes/:slug > /tribes/:slug/partups not /tribes/:slug > /profile/:_id
    RouteController.prototype.renderRoute = function(routeName) {
        let self = this;
        let regions = Router.routes[routeName].options.yieldRegions;
        _.each(regions, function(item, key) {
            self.render(key, item);
        });
    };

    Router.replaceYieldTemplate = function(newTemplate, target) {
        let currentRoute = this.current();
        currentRoute.render(newTemplate, { to: target });
    };
} else {
    Router.route('/dreams/:path(.*)', {
        where: 'server',
        action: function() {
            let url = 'http://blog.partup.com/dreams/' + this.params.path;
            this.response.writeHead(301, { Location: url });
            return this.response.end();
        },
    });

    Router.route('/blogs/:path(.*)', {
        where: 'server',
        action: function() {
            let url = 'http://blog.partup.com/blogs/' + this.params.path;
            this.response.writeHead(301, { Location: url });
            return this.response.end();
        },
    });

    if (
        mout.object.get(Meteor, 'settings.public.aws.bucket') == 'development'
    ) {
        let fs = Npm.require('fs');
        let basedir =
            process.cwd().replace(/\/app\/(.*)$/, '/app') + '/uploads';

        Router.route('/uploads/:path(.*)', {
            where: 'server',
            action: function() {
                let path = '/' + this.params.path;
                let file = fs.readFileSync(basedir + path);
                let ext = path.match(/\.([^.]+)/)[1];
                if (ext === 'jpg') ext = 'jpeg';

                let headers = {
                    'Content-type': 'image/' + ext,
                    'Content-Disposition': 'attachment; filename=' + path,
                };

                this.response.writeHead(200, headers);
                return this.response.end(file);
            },
        });
    }
}
