var d = Debug('services:emails');
const _ = require('lodash');
const moment = require('moment');

const canReceiveEmails = (user) => {
  const deactivated = _.get(user, 'deactivatedAt');
  const deleted = _.get(user, 'deletedAt');

  return !deactivated && !deleted;
};

/**
 @namespace Partup server email service
 @name Partup.server.services.emails
 @memberof Partup.server.services
 */
Partup.server.services.emails = {
    /**
     * Send an email
     *
     * @param {Object} options
     * @param {String} options.type
     * @param {Object} options.typeData
     * @param {String} options.toAddress
     * @param {String} options.fromAddress
     * @param {String} options.subject
     * @param {String} options.locale
     * @param {Object} options.userEmailPreferences
     * @param {String|null} options.body
     * @param {Object} existingUser Email service will use this user object to check if it's deactivated
     */
    send(options, existingUser) {

        // If 'existingUser' is not specified the email is not for a member, e.g. invite activity by email.
        // This means the following checks are only required when a user is specified.
        if (existingUser) {
            if (!canReceiveEmails(existingUser)) {
                return;
            }

            // if options.toAddress is not verified send a verification mail
            // only when the last received verification mail was over 7 days ago
            if (!User(existingUser).hasVerifiedEmail(options.toAddress)) {

                const usr = Meteor.users.findOne({ _id: existingUser._id, 'emails.address': options.toAddress }, { fields: { emails: 1 } });

                for (let e of usr.emails) {
                  if (e.address === options.toAddress) {
                    const sendIfMoreThanZero = moment().subtract(7, 'days').diff(moment(e.lastVerificationMail));

                    if (!e.lastVerificationMail || sendIfMoreThanZero > 0) {
                        Accounts.sendVerificationEmail(existingUser._id, options.toAddress);
                        Meteor.users.update({ _id: existingUser._id, 'emails.address': options.toAddress }, { $set: { 'emails.$.lastVerificationMail': new Date() } });
                        break;
                    }
                  }
                }

                return;
            }
        }

        Meteor.defer(function() {
            options = options || {};
            var emailSettings = {};

            if (!options.type) throw new Meteor.Error('Required argument [options.type] is missing for method [Partup.server.services.emails::send]');
            if (!options.typeData) throw new Meteor.Error('Required argument [options.typeData] is missing for method [Partup.server.services.emails::send]');
            if (!options.toAddress) throw new Meteor.Error('Required argument [options.toAddress] is missing for method [Partup.server.services.emails::send]');
            if (!options.fromAddress) options.fromAddress = Partup.constants.EMAIL_FROM;
            if (!options.subject) throw new Meteor.Error('Required argument [options.subject] is missing for method [Partup.server.services.emails::send]');
            if (!options.locale) throw new Meteor.Error('Required argument [options.locale] is missing for method [Partup.server.services.emails::send]');

            // Check if user has disabled this email type
            if (options.userEmailPreferences && !options.userEmailPreferences[options.type]) {
                // This mail is disabled, so end here
                return;
            }

            options.typeData.baseUrl = Meteor.absoluteUrl();

            emailSettings.from = options.fromAddress;
            emailSettings.to = options.toAddress;
            emailSettings.subject = options.subject;

            // Check if locale needs a fallback to provide an existing mail template
            if (options.locale !== 'en' && options.locale !== 'nl') {
                options.locale = 'en';
            }

            var template = 'email-' + options.type + '-' + options.locale;
            emailSettings.html = SSR.render(template, options.typeData);
            emailSettings.headers = {
                'X-Mailgun-Tag': template
            };

            Email.send(emailSettings);
        });
    }
};
