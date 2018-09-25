// jscs:disable
/**
 * Render login form functionality
 *
 * @module client-login
 *
 */
// jscs:enable

var isChrome = navigator.userAgent.match('CriOS');

var formPlaceholders = {
    email: function() {
        return TAPi18n.__('login-form-email-placeholder');
    },
    password: function() {
        return TAPi18n.__('login-form-password-placeholder');
    }
};

if (isChrome) {
    // Success callback when using loginStyle: redirect
    Accounts.onLogin(function() {
        if (Router && Router.current().route.getName() === 'login') {
            Router.go('discover');
        }
    });

    // Failure callback when using loginStyle: redirect
    Accounts.onLoginFailure(function() {
        if (Router && Router.current().route.getName() === 'login') {
            Router.go('discover');
        }
    });
}

var submitting = new ReactiveVar(false);
var facebookLoading = new ReactiveVar(false);
var linkedinLoading = new ReactiveVar(false);

Template.Login.onCreated(function() {
    submitting.set(false);
    facebookLoading.set(false);
    linkedinLoading.set(false);
});

/*************************************************************/
/* Widget helpers */
/*************************************************************/
Template.Login.helpers({
    formSchema: Partup.schemas.forms.login,
    placeholders: formPlaceholders,
    submitting: function() {
        return submitting.get();
    },
    facebookLoading: function() {
        return facebookLoading.get();
    },
    linkedinLoading: function() {
        return linkedinLoading.get();
    }
});

/*************************************************************/
/* Widget events */
/*************************************************************/
Template.Login.events({
    'click [data-createaccount]': function(event) {
        event.preventDefault();
        Intent.go({route: 'register'}, function() {
            if (Meteor.user()) {
                continueLogin();
            } else {
                this.back();
            }
        }, {prevent_going_back: true});
    },
    'click [data-loginfacebook]': function(event) {
        event.preventDefault();

        facebookLoading.set(true);

        Meteor.loginWithFacebook({
            requestPermissions: ['email'],
            loginStyle: isChrome ? 'redirect' : 'popup'
        }, function(error) {
            facebookLoading.set(false);

            if (error) {
                Partup.client.notify.error(TAPi18n.__('login-error_' + Partup.client.strings.slugify(error.reason)), { timeOut: 6000 });
                return;
            }

            continueLogin();
        });
    },
    'click [data-loginlinkedin]': function(event) {
        event.preventDefault();

        linkedinLoading.set(true);

        Meteor.loginWithLinkedin({
            requestPermissions: ['r_emailaddress', 'r_basicprofile'],
            loginStyle: isChrome ? 'redirect' : 'popup'
        }, function(error) {
            linkedinLoading.set(false);

            if (error) {
                Partup.client.notify.error(TAPi18n.__('login-error_' + Partup.client.strings.slugify(error.reason)), { timeOut: 6000 });
                return false;
            }

            continueLogin();
        });
    }
});

/*************************************************************/
/* Widget functions */
/*************************************************************/
const continueLogin = function() {
    var user = Meteor.user();
    if (!user) return;

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

    // Return if intent callback is present
    Intent.return('login', {
        arguments: [user],
        fallback_action: function() {
            if (mout.object.get(user, 'profile.settings.optionalDetailsCompleted')) {
                Router.go('myactivities');
            } else {
                Intent.go({route: 'register-details'}, function() {
                    Router.go('myactivities');
                });
            }
        }
    });
};

/*************************************************************/
/* Widget form hooks */
/*************************************************************/
AutoForm.hooks({
    loginForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            var self = this;

            submitting.set(true);

            Meteor.loginWithPassword(insertDoc.email, insertDoc.password, function(error) {
                submitting.set(false);

                // Error cases
                if (error && error.message) {
                    switch (error.message) {
                        case 'User not found [403]':
                            Partup.client.forms.addStickyFieldError(self, 'email', 'emailNotFound');
                            break;
                        case 'Incorrect password [403]':
                            Partup.client.forms.addStickyFieldError(self, 'password', 'passwordIncorrect');
                            break;
                        case 'User is deactivated [403]':
                            Partup.client.forms.addStickyFieldError(self, 'email', 'accountDeactivated');
                            break;
                        default:
                            Partup.client.notify.error(TAPi18n.__('login-error_' + Partup.client.strings.slugify(error.reason)), { timeOut: 6000 });
                    }
                    AutoForm.validateForm(self.formId);
                    self.done(new Error(error.message));
                    return false;
                }

                // Success
                self.done();
                continueLogin();
            });

            return false;
        }
    }
});
