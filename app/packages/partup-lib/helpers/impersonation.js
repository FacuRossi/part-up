const impersonationDuration = 1800000; // 30mins

export const IMPERSONATION_REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
};

const impersonation = Object.freeze({
  durationMS: impersonationDuration,

  IMPERSONATION_REQUEST_STATUS,

  isActive(impersonationRequest = {}) {
    const isAccepted = impersonationRequest.status === IMPERSONATION_REQUEST_STATUS.ACCEPTED;
    const timeDiff = moment(impersonationRequest.created_at).diff(moment().subtract(30, 'minutes'));
    const isWithin30MinutesOfCreationDate = timeDiff > 0 && timeDiff <= impersonationDuration;

    return isAccepted && isWithin30MinutesOfCreationDate;
  },
  isExpired(impersonationRequest = {}) {
    return moment(impersonationRequest.created_at).diff(moment().subtract(30, 'minutes')) <= 0;
  },

  timeLeft(impersonationRequest = {}) {
    if (!impersonationRequest.created_at) {
      return 0;
    }
    return moment(impersonationRequest.created_at).diff(moment().subtract(30, 'minutes')).valueOf();
  },
});

if (!Partup.helpers) {
  Partup.helpers = {};
}
Partup.helpers.impersonation = impersonation;
export default impersonation;
