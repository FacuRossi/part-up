var placeholders = {
    'name': function() {
        return TAPi18n.__('pages-modal-register-signup-form-name-placeholder');
    },
    'email': function() {
        return TAPi18n.__('pages-modal-register-signup-form-email-placeholder');
    },
    'password': function() {
        return TAPi18n.__('pages-modal-register-signup-form-password-placeholder');
    },
    'confirmPassword': function() {
        return TAPi18n.__('pages-modal-register-signup-form-confirmPassword-placeholder');
    },
    'network': function() {
        return TAPi18n.__('pages-modal-register-signup-form-network-placeholder');
    }
};

var submitting = new ReactiveVar(false);
var facebookLoading = new ReactiveVar(false);
var linkedinLoading = new ReactiveVar(false);

Template.modal_register_signup.onCreated(function() {
    var template = this;

    submitting.set(false);
    facebookLoading.set(false);
    linkedinLoading.set(false);

    this.agreedToTos = new ReactiveVar(false, (oldVal, newVal) => {
      const node = this.find('.pu-sub-terms');

      if (newVal) {
        node.classList.remove('pu-sub-terms-invalid');
      }
    });
    this.checkTos = () => {
      const node = this.find('.pu-sub-terms');
      const curVal = this.agreedToTos.curValue;

      if (!curVal) {
        Partup.client.notify.error(TAPi18n.__('must-agree-tos'));

        const invalidClass = 'pu-sub-terms-invalid';
        if (!node.classList.contains(invalidClass)) {
          node.classList.add(invalidClass);
        }
      }

      return curVal;
    }

    template.userCount = new ReactiveVar();
    HTTP.get('/users/count', function(error, response) {
        if (error || !response || !mout.lang.isString(response.content)) { return; }

        var content = JSON.parse(response.content);
        template.userCount.set(content.count);
    });
});

/*************************************************************/
/* Widget helpers */
/*************************************************************/
Template.modal_register_signup.helpers({
    formSchema: Partup.schemas.forms.registerRequired,
    placeholders: placeholders,
    totalNumberOfUppers: function() {
        return Template.instance().userCount.get();
    },
    submitting: function() {
        return submitting.get();
    },
    facebookLoading: function() {
        return facebookLoading.get();
    },
    linkedinLoading: function() {
        return linkedinLoading.get();
    },
    prefill: function() {
        return {
            email: Template.instance().data.prefillEmail || ''
        };
    },
    prefillEmail: function() {
        return Template.instance().data.prefillEmail;
    },
    agreedToTos() {
      return Template.instance().agreedToTos.get();
    }
});

/*************************************************************/
/* Widget events */
/*************************************************************/
Template.modal_register_signup.events({
  'click [data-tos]'(event, templateInstance) {
    const checked = templateInstance.agreedToTos.curValue;
    const checkboxNode = templateInstance.find('.tos-checkbox');
    checkboxNode.checked = !checked;
    templateInstance.agreedToTos.set(checkboxNode.checked);
  },
    'click [data-signupfacebook]': function(event, templateInstance) {
        event.preventDefault();

        if (!templateInstance.checkTos()) {
          return;
        }

        facebookLoading.set(true);
        Meteor.loginWithFacebook({
            requestPermissions: ['email'],
            loginStyle: navigator.userAgent.match('CriOS') ? 'redirect' : 'popup'
        }, function(error) {
            facebookLoading.set(false);

            if (error) {
                Partup.client.notify.error(TAPi18n.__('pages-modal-register-signup-error_' + Partup.client.strings.slugify(error.reason)));
                return;
            }

            var partupId = Session.get('partup_access_token_for_partup');
            var partupAccessToken = Session.get('partup_access_token');
            if (partupId && partupAccessToken) {
                Meteor.call('partups.convert_access_token_to_invite', partupId, partupAccessToken);
            }

            var networkSlug = Session.get('network_access_token_for_network');
            var networkAccessToken = Session.get('network_access_token');
            if (networkSlug && networkAccessToken) {
                Meteor.call('networks.convert_access_token_to_invite', networkSlug, networkAccessToken);
            }

            analytics.track('User registered', {
                userId: Meteor.user()._id,
                method: 'facebook'
            });

            Router.go('register-details');
        });
    },
    'click [data-signuplinkedin]': function(event, templateInstance) {
        event.preventDefault();

        if (!templateInstance.checkTos()) {
          return;
        }

        linkedinLoading.set(true);
        Meteor.loginWithLinkedin({
            requestPermissions: ['r_emailaddress', 'r_basicprofile'],
            loginStyle: navigator.userAgent.match('CriOS') ? 'redirect' : 'popup'
        }, function(error) {
            linkedinLoading.set(false);

            if (error) {
                Partup.client.notify.error(TAPi18n.__('pages-modal-register-signup-error_' + Partup.client.strings.slugify(error.reason)));
                return false;
            }

            var partupId = Session.get('partup_access_token_for_partup');
            var partupAccessToken = Session.get('partup_access_token');
            if (partupId && partupAccessToken) {
                Meteor.call('partups.convert_access_token_to_invite', partupId, partupAccessToken);
            }

            var networkSlug = Session.get('network_access_token_for_network');
            var networkAccessToken = Session.get('network_access_token');
            if (networkSlug && networkAccessToken) {
                Meteor.call('networks.convert_access_token_to_invite', networkSlug, networkAccessToken);
            }

            analytics.track('User registered', {
                userId: Meteor.user()._id,
                method: 'linkedin'
            });

            var locale = Partup.helpers.parseLocale(navigator.language || navigator.userLanguage);

            Meteor.call('settings.update', {locale: locale}, function(err) {
                if (err) {
                    Partup.client.notify.error(TAPi18n.__('pages-modal-register-signup-error_' + Partup.client.strings.slugify('failed to update locale')));
                    return false;
                }

                Router.go('register-details');
            });
        });
    }
});

/*************************************************************/
/* Widget form hooks */
/*************************************************************/
AutoForm.hooks({
    'pages-modal-register-signupForm': {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
          if (!this.template.parent().checkTos()) {
            return false;
          }

            submitting.set(true);
            var self = this;
            var submittedDoc = insertDoc;
            var locale = Partup.client.language.current.get();

            Accounts.createUser({
                email: submittedDoc.email,
                password: submittedDoc.password,
                profile: {
                    name: submittedDoc.name,
                    settings: {
                        locale: locale
                    }
                }
            }, function(error) {
                submitting.set(false);

                // Error cases
                if (error && error.message) {
                    switch (error.message) {
                        case 'Email already exists [403]':
                            Partup.client.forms.addStickyFieldError(self, 'email', 'emailExists');
                            break;
                        default:
                            Partup.client.notify.error(TAPi18n.__('pages-modal-register-signup-error_' + Partup.client.strings.slugify(error.reason)));
                    }
                    AutoForm.validateForm(self.formId);
                    self.done(new Error(error.message));
                    return false;
                }

                // Success
                self.done();

                var partupId = Session.get('partup_access_token_for_partup');
                var partupAccessToken = Session.get('partup_access_token');
                if (partupId && partupAccessToken) {
                    Meteor.call('partups.convert_access_token_to_invite', partupId, partupAccessToken);
                }

                var networkSlug = Session.get('network_access_token_for_network');
                var networkAccessToken = Session.get('network_access_token');
                if (networkSlug && networkAccessToken) {
                    Meteor.call('networks.convert_access_token_to_invite', networkSlug, networkAccessToken);
                }

                analytics.track('User registered', {
                    userId: Meteor.user()._id,
                    method: 'email'
                });

                Router.go('register-details');
            });

            return false;
        }
    }
});
