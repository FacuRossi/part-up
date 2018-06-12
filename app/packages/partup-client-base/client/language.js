/**
 * All language related functionality
 *
 * @class language
 * @memberof Partup.client
 */

Partup.client.language = {
    current: new ReactiveVar(),
    /**
     * Set the language of partup
     *
     * @memberof Partup.client.language
     * @param {String} language
     */
    change(language) {
        const self = this;
        const currentLanguage = self.current.get();

        if (language === currentLanguage) {
          return;
        }

        TAPi18n.setLanguage(language).done(function() {
            moment.locale(language);
            self.current.set(language);
            // Change datepicker language
            $.fn.datepicker.dates[language] = {
                days: moment.weekdays(),
                daysShort: moment.weekdaysShort(),
                daysMin: moment.weekdaysMin(),
                months: moment.months(),
                monthsShort: moment.monthsShort(),
                today: 'Today',
                clear: 'Clear'
            };

            // Change datepicker options
            Partup.client.datepicker.options.format = moment.localeData().longDateFormat('L').toLowerCase();
            Partup.client.datepicker.options.language = language;

            // Change SimpleSchema error messages language
            SimpleSchema.messages({
                required:            TAPi18n.__('base-client-language-ss-required'),
                minString:           TAPi18n.__('base-client-language-ss-minString'),
                maxString:           TAPi18n.__('base-client-language-ss-maxString'),
                individualMaxString: TAPi18n.__('base-client-language-ss-individualMaxString'),
                minNumber:           TAPi18n.__('base-client-language-ss-minNumber'),
                maxNumber:           TAPi18n.__('base-client-language-ss-maxNumber'),
                minDate:             TAPi18n.__('base-client-language-ss-minDate'),
                maxDate:             TAPi18n.__('base-client-language-ss-maxDate'),
                badDate:             TAPi18n.__('base-client-language-ss-badDate'),
                minCount:            TAPi18n.__('base-client-language-ss-minCount'),
                maxCount:            TAPi18n.__('base-client-language-ss-maxCount'),
                noDecimal:           TAPi18n.__('base-client-language-ss-noDecimal'),
                notAllowed:          TAPi18n.__('base-client-language-ss-notAllowed'),
                expectedString:      TAPi18n.__('base-client-language-ss-expectedString'),
                expectedNumber:      TAPi18n.__('base-client-language-ss-expectedNumber'),
                expectedBoolean:     TAPi18n.__('base-client-language-ss-expectedBoolean'),
                expectedArray:       TAPi18n.__('base-client-language-ss-expectedArray'),
                expectedObject:      TAPi18n.__('base-client-language-ss-expectedObject'),
                expectedConstructor: TAPi18n.__('base-client-language-ss-expectedConstructor'),
                keyNotInSchema:      TAPi18n.__('base-client-language-ss-keyNotInSchema'),
                regEx: [
                                                            {msg: TAPi18n.__('base-client-language-ss-regex-default')},
                    {exp: Partup.services.validators.email,  msg: TAPi18n.__('base-client-language-ss-regex-Email')},
                    {exp: SimpleSchema.RegEx.Domain,         msg: TAPi18n.__('base-client-language-ss-regex-Domain')},
                    {exp: SimpleSchema.RegEx.WeakDomain,     msg: TAPi18n.__('base-client-language-ss-regex-WeakDomain')},
                    {exp: SimpleSchema.RegEx.IP,             msg: TAPi18n.__('base-client-language-ss-regex-IP')},
                    {exp: SimpleSchema.RegEx.IPv4,           msg: TAPi18n.__('base-client-language-ss-regex-IPv4')},
                    {exp: SimpleSchema.RegEx.IPv6,           msg: TAPi18n.__('base-client-language-ss-regex-IPv6')},
                    {exp: SimpleSchema.RegEx.Url,            msg: TAPi18n.__('base-client-language-ss-regex-Url')},
                    {exp: SimpleSchema.RegEx.Id,             msg: TAPi18n.__('base-client-language-ss-regex-Id')},
                ],
                passwordMismatch:       TAPi18n.__('base-client-language-ss-passwordMismatch'),
                emailExists:            TAPi18n.__('base-client-language-ss-emailExists'),
                emailNotFound:          TAPi18n.__('base-client-language-ss-emailNotFound'),
                accountDeactivated:     TAPi18n.__('base-client-language-ss-accountDeactivated'),
                passwordIncorrect:      TAPi18n.__('base-client-language-ss-passwordIncorrect'),
                shouldNotContainHtml:   TAPi18n.__('base-client-language-ss-shouldNotContainHtml'),
                missingRequiredTags:    TAPi18n.__('base-client-language-ss-missingRequiredTags'),
                shouldNotContainUrls:   TAPi18n.__('base-client-language-ss-shouldNotContainUrls'),
            });

            const user = Meteor.user();
            if (user && User(user).getProperLocale() !== language) {
              // Only update if there's actually a new language, reactiveness causes this to run many times.
              Meteor.call('settings.update', {locale: language}, function(err) {
                  if (err) {
                      Partup.client.notify.error('Could not set the correct language');
                      return;
                  }
              });
            }
        }).fail(function(error_message) {
            Partup.client.notify.error('Could not load the language "' + language + '"');
        });
    },
    /**
     * Checks for the browser language settings and returns the locale
     * Only to be used if everything else fails.
     *
     * @memberof Partup.client.language
     */
    getBrowserDefaultLocale: function() {
        var language = 'en';
        if (TAPi18n && Partup) {
            var detectedLocale = navigator.userLanguage || navigator.language;
            if (detectedLocale && detectedLocale.match(/^[a-z]{2}-[a-z]{2}$/i)) {
                detectedLocale = detectedLocale.split('-')[0];
            }
            language = detectedLocale || 'en';
        }
        return language;
    },

};
