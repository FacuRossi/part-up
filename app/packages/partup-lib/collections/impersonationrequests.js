ImpersonationRequests = new Mongo.Collection('impersonationrequests');

if (Meteor.isServer) {
  ImpersonationRequests._ensureIndex('userId');
};

ImpersonationRequests.findOneActiveRequest = function(userId, status) {
  const viewerId = Meteor.userId();

  const query = {
    userId: userId,
    created_at: {
      $gte: new Date((moment().subtract(30, 'minutes').toISOString()))
    }
  };

  if (status) {
    query.status = status;
  }

  const request = this.find(query, {
    sort: { created_at: -1 },
    limit: 1,
  }).fetch().pop();

  if (request && (request.userId === viewerId || request.adminId === viewerId)) {
    return request;
  }
  return undefined;
}

ImpersonationRequests.findAcceptedRequests = function() {
  const { impersonation } = Partup.helpers;

  return this.find({
    adminId: Meteor.userId(),
    status: impersonation.IMPERSONATION_REQUEST_STATUS.ACCEPTED,
    accepted_at: {
      $gte: new Date((moment().subtract(30, 'minutes').toISOString()))
    }
  }).fetch();
}
