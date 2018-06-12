import _ from 'lodash';

const impersonationDuration = 1800000; // 30mins

if (!Partup.helpers) {
  Partup.helpers = {};
}

Partup.helpers.impersonation = {
  durationMS: impersonationDuration,

  getLastDate(user) {
    return _.get(user, 'impersonation', []).splice(-1)[0];
  },

  timeLeft(impersonationDate) {
    if (!impersonationDate) {
      return 0;
    }
    return impersonationDuration - moment(new Date()).diff(moment(impersonationDate));
  },

};
