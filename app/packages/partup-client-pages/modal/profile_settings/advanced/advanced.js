import { userProfileVisibilityLevels } from 'meteor/partup-lib';

Template.modal_profile_settings_advanced.onCreated(function() {
  this.submitting = new ReactiveVar(false);
  this.submittingImpersonationRequest = new ReactiveVar(false);

  const { impersonation } = Partup.helpers;

  // Reactive in order to automatically hide the option to allow the request when the time expires.
  this.impersonationRequest = new ReactiveVar(undefined, (oldVal, newVal) => {
    if (newVal) {
      if (impersonation.isActive(newVal)) {
        Meteor.defer(() => {
          const checkboxNode = this.find('.impersonate-checkbox');
          if (checkboxNode) {
            checkboxNode.checked = true;
          }
          Meteor.setTimeout(() => {
            this.impersonationRequest.set(undefined);
          }, impersonation.timeLeft(newVal));
        });
      }
    }
  });

  Meteor.call('users.get_non_expired_impersonation_request', (error, result) => {
    if (result) {
      this.impersonationRequest.set(result);
    }
  });

  this.activeVisibilityLevel = new ReactiveVar(null);
  Meteor.call('users.getProfileVisibility', this.data.profileId, (error, level) => {

    if (error) {
      Partup.client.notify.error(error.reason);
    } else if (!level) {
    } else {
      this.activeVisibilityLevel.set(level);
    }
  });
});

Template.modal_profile_settings_advanced.helpers({
	submitting: function() {
    return Template.instance().submitting.get();
  },
  showImpersonationRequest() {
    const { impersonation } = Partup.helpers;
    const request = Template.instance().impersonationRequest.get();

    return request && impersonation.timeLeft(request) > 0;
  },
  requesterName() {
    const request = Template.instance().impersonationRequest.get();
    if (!request) {
      return;
    }

    const admin = Meteor.users.findOne(request.adminId);
    return admin
      ? User(admin).getFirstname()
      : 'an admin';
  },
  visibilityLevels() {
    return userProfileVisibilityLevels.levels;
  },
  isActiveProfileVisibilityLevel(level) {
    return Template.instance().activeVisibilityLevel.get() === level;
  },
  showImpersonationRequest() {
    const { impersonation } = Partup.helpers;
    const request = Template.instance().impersonationRequest.get();

    return request && impersonation.timeLeft(request) > 0;
  },
  requesterName() {
    const request = Template.instance().impersonationRequest.get();
    if (!request) {
      return;
    }

    const admin = Meteor.users.findOne(request.adminId);
    return admin
      ? User(admin).getFirstname()
      : 'an admin';
  }
});
/*************************************************************/
/* Page events */
/*************************************************************/
Template.modal_profile_settings_advanced.events({
    'click [data-delete-account]': function(event, template) {
        template.submitting.set(true);

        Partup.client.prompt.confirm({
            title: TAPi18n.__('modal-profilesettings-advanced-delete-title'),
            message: TAPi18n.__('modal-profilesettings-advanced-delete-message'),
            confirmButton: TAPi18n.__('modal-profilesettings-advanced-delete-confirm-button'),
            cancelButton: TAPi18n.__('modal-profilesettings-advanced-delete-cancel-button'),
            onConfirm: function() {
                Meteor.call('users.delete', function(error, response) {
                    Partup.client.notify.success(TAPi18n.__('modal-profilesettings-advanced-delete-success'));
                    Partup.client.user.logout() // Logout
                    Intent.go({route: 'home'}); // Redirect to home
                    template.submitting.set(false);
                });
            }
        });
    },
    'click [data-allow-impersonation]'(event, templateInstance) {
      event.preventDefault();
      if (templateInstance.submittingImpersonationRequest.curValue) {
        return;
      }
      const { impersonation } = Partup.helpers;
      const impersonationRequest = templateInstance.impersonationRequest.curValue;

      templateInstance.submittingImpersonationRequest.set(true);

      if (impersonation.isActive(impersonationRequest)) {
        Partup.client.notify.warning(TAPi18n.__(`impersonation-still-active`, { minutes: Math.floor(impersonation.timeLeft(impersonationRequest) / 60000) }));
      } else {

        Meteor.call('users.allow_impersonation', (error, result) => {
          if (error) {
            Partup.client.notify.error(TAPi18n.__(error.reason));
          } else if (result === -1) {
            Partup.client.notify.error(TAPi18n.__('impersonation-error-cannot-allow'));
          } else {
            Partup.client.notify.info(TAPi18n.__('impersonation-allow-success'));
            templateInstance.impersonationRequest.set(result);
          }
          templateInstance.submittingImpersonationRequest.set(false);
        });

      }
    },
    'click [data-intercom-export-data]'(event, template) {
        event.preventDefault();

        if (typeof Intercom !== "undefined") {
          Intercom('showNewMessage', TAPi18n.__('intercom-question-export-data'));
        } else {
          Partup.client.notify.error(TAPi18n.__('error-intercom-not-available'));
        }
    },
    'click [data-level]'(event, templateInstance) {
      const level = $(event.target).data('level');
      if (level) {
        templateInstance.activeVisibilityLevel.set(level)
      }
    },
    'click [data-update-level]'(event, templateInstance) {
      const currentLevel = templateInstance.activeVisibilityLevel.curValue;

      Meteor.call('users.setProfileVisibility', templateInstance.data.profileId, currentLevel, (error, result) => {
        if (error) {
          Partup.client.notify.error(error.reason);
        } else if (result) {
          Partup.client.notify.info(TAPi18n.__('modal-profilesettings-advanced-profile_visibility-updated'));
        }
      });
    },
    'click [data-intercom-export-data]'(event, template) {
        event.preventDefault();

        if (typeof Intercom !== "undefined") {
          Intercom('showNewMessage', TAPi18n.__('intercom-question-export-data'));
        } else {
          Partup.client.notify.error(TAPi18n.__('error-intercom-not-available'));
        }
    }
});
