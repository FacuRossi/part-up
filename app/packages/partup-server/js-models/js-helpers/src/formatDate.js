'use strict';

import check, { optional } from 'powercheck';
import moment from 'moment';

export default {
    relativeWithThreshold: (targetDate, nowDate) => {
        check.throw(targetDate, Date);
        check.throw(nowDate, optional(Date));

        var TWO_HOURS = 2 * 60 * 60 * 1000; // <-- 2 hours
        var ONE_DAY = 24 * 60 * 60 * 1000;
        var ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

        const targetMoment = moment(targetDate);
        const nowMoment = moment(nowDate || new Date());

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
