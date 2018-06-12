import { get } from 'lodash';


Template.modal_profile_settings_advanced.onCreated(function() {
  this.submitting = new ReactiveVar(false);
  const { impersonation } = Partup.helpers;

  const user = Meteor.user();
  const lastImpersonationDate = impersonation.getLastDate(user);
  const timeLeft = impersonation.timeLeft(lastImpersonationDate);

  if (timeLeft > 0) {
    Meteor.defer(() => {
      this.find('.impersonate-checkbox').checked = true;
    });
  }
});

Template.modal_profile_settings_advanced.helpers({
	submitting: function() {
        return Template.instance().submitting.get();
  },
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
      const checkboxNode = templateInstance.find('.impersonate-checkbox');

      const { impersonation } = Partup.helpers;
      const lastImpersonationDate = impersonation.getLastDate(Meteor.user());
      const timeLeft = impersonation.timeLeft(lastImpersonationDate);

      if (timeLeft > 0) {
        Partup.client.notify.warning(TAPi18n.__(`impersonation-still-active`, { minutes: Math.floor(timeLeft / 60000) }));
      } else {
        Meteor.call('users.allow_impersonation', (error, result) => {
          if (error) {
            Partup.client.notify.error(TAPi18n.__(error.reason));
          } else {
            checkboxNode.checked = true;
            Partup.client.notify.info(TAPi18n.__('impersonation-allow-success'));
          }
        });
      }
    },
});
