import { get } from 'lodash';

/*************************************************************/
/* Partial rendered */
/*************************************************************/

Template.app_partup_navigation.onCreated(function() {
  const template = this;
  template.toggle = {
      settings: new ReactiveVar(false),
      share: new ReactiveVar(false),
  }
});

/*************************************************************/
/* Partial helpers */
/*************************************************************/
Template.app_partup_navigation.helpers({
    settingsToggled() {
        return Template.instance().toggle.settings;
    },
    shareToggled() {
        return Template.instance().toggle.share;
    },
    selectorSettings() {
        if (this.partup && this.partup.slug) {
            return {
                slug: this.partup.slug,
                data: this.partup,
                currentRoute: Router.current().route.getName()
            }
        }
    },
    isPartner(user) {
      if (user) {
        return User(user).isPartnerInPartup(get(this.partup, '_id'));
      }
      return false;
    },
    renderIconText() {
      return this.renderIconText !== undefined ? this.renderIconText : !User(Meteor.user()).isPartnerOrSupporterInPartup(get(this.partup, '_id'));
    },
});

Template.app_partup_navigation.events({
    'click [data-toggle-partup-settings-dropdown]': function (event, template) {
        event.preventDefault()
        template.toggle.settings.set(!template.toggle.settings.curValue);
    },
    'click [data-open-partup-settings]': function(event, template) {
        event.preventDefault();
        Intent.go({
            route: 'partup-settings',
            params: {
                slug: template.data.partup.slug
            }
        });
    },
    'click [data-archive-partup]'(event, templateInstance) {
      event.preventDefault();
      Partup.client.prompt.confirm({
        title: TAPi18n.__('pages-app-partup-popup-title-archive', {partup: templateInstance.data.partup.name}),
        message: TAPi18n.__('pages-app-partup-popup-message-archive'),
        confirmButton: TAPi18n.__('pages-app-popup-confirmation-confirm-button'),
        cancelButton: TAPi18n.__('pages-app-popup-confirmation-cancel-button'),
        onConfirm: function () {
            Meteor.call('partups.archive', templateInstance.data.partup._id, function(error, result) {
              if (!error) {
                Partup.client.notify.info(TAPi18n.__('notify-partup-archived-success', {partup: templateInstance.data.partup.name}));
              }
            });
        }
    });
    },
    'click [data-end-partup-partnership]': function (event, template) {
        event.preventDefault()
        Partup.client.prompt.confirm({
            title: TAPi18n.__('pages-app-partup-popup-title-unpartner', {partup: template.data.partup.name}),
            message: TAPi18n.__('pages-app-partup-popup-message-unpartner'),
            confirmButton: TAPi18n.__('pages-app-popup-confirmation-confirm-button'),
            cancelButton: TAPi18n.__('pages-app-popup-confirmation-cancel-button'),
            onConfirm: function () {
                Meteor.call('partups.unpartner', template.data.partup._id)
            }
        });
    },
    'click [data-toggle-partup-share-dropdown]': function(event, template) {
        event.preventDefault();
        template.toggle.share.set(!template.toggle.share.curValue);
    },
    'click [data-share-facebook]': function(event, template) {
        const currentUrl = Router.url('partup', {slug: template.data.partup.slug});
        const shareUrl = Partup.client.socials.generateFacebookShareUrl(currentUrl);

        window.open(shareUrl, 'pop', 'width=600, height=400, scrollbars=no');

        analytics.track('partup share facebook', {
            partupId: template.data.partup._id,
        });
    },
    'click [data-share-twitter]': function(event, template) {
        const currentUrl = Router.url('partup', {slug: template.data.partup.slug});
        const shareUrl = Partup.client.socials.generateTwitterShareUrl(template.data.partup.name, currentUrl);

        window.open(shareUrl, 'pop', 'width=600, height=400, scrollbars=no');

        analytics.track('partup share twitter', {
            partupId: template.data.partup._id,
        });
    },
    'click [data-share-linkedin]': function(event, template) {
        const currentUrl = Router.url('partup', {slug: template.data.partup.slug});
        const shareUrl = Partup.client.socials.generateLinkedInShareUrl(currentUrl);

        window.open(shareUrl, 'pop', 'width=600, height=400, scrollbars=no');

        analytics.track('partup share linkedin', {
            partupId: template.data.partup._id,
        });
    },
    'click [data-share-mail]': function(event, template) {
        const user = Meteor.user();
        const currentUrl = Router.url('partup', {slug: template.data.partup.slug});

        const body = user
            ? TAPi18n.__('pages-app-partup-share_mail', {url: currentUrl, partup_name: template.data.partup.name, user_name: user.profile.name})
            : TAPi18n.__('pages-app-partup-share_mail_anonymous', {url: currentUrl, partup_name: template.data.partup.name});

        const shareUrl = Partup.client.socials.generateMailShareUrl('', body);
        window.location.href = shareUrl;
    },
});
