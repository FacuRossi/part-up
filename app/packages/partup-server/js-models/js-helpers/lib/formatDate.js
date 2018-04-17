'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _powercheck = require('powercheck');

var _powercheck2 = _interopRequireDefault(_powercheck);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    relativeWithThreshold: function relativeWithThreshold(targetDate, nowDate) {
        _powercheck2.default.throw(targetDate, Date);
        _powercheck2.default.throw(nowDate, (0, _powercheck.optional)(Date));

        var TWO_HOURS = 2 * 60 * 60 * 1000; // <-- 2 hours
        var ONE_DAY = 24 * 60 * 60 * 1000;
        var ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

        var targetMoment = (0, _moment2.default)(targetDate);
        var nowMoment = (0, _moment2.default)(nowDate || new Date());

        if (nowMoment.diff(targetMoment) < TWO_HOURS) {
            // <-- less than 2 hours ago
            return targetMoment.fromNow();
        } else if (nowMoment.diff(targetMoment) < ONE_DAY) {
            // <-- less than 1 day ago
            return targetMoment.format('HH:mm');
        } else if (nowMoment.diff(targetMoment) < ONE_WEEK) {
            // <-- less than 1 week ago
            return targetMoment.format('dddd [at] HH:mm');
        } else if (targetMoment.year() === nowMoment.year()) {
            // <-- less than a year ago
            return targetMoment.format('MMMM D [at] HH:mm');
        } else {
            // <-- more than a year ago
            return targetMoment.format('MMMM D YYYY [at] HH:mm');
        }
    }
};
module.exports = exports['default'];