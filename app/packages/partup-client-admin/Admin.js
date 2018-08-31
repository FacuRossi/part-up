import _ from 'lodash';
import impersonation from "../partup-lib/helpers/impersonation";

Template.Admin.onCreated(function() {
    var template = this;

    template.users = new ReactiveVar([]);
    template.partupstats = new ReactiveVar([]);
    template.userstats = new ReactiveVar([]);
    template.page = 0;
    template.limit = 20;

    Meteor.call('users.admin_all', {}, {
        page: template.page,
        limit: template.limit
    }, function(error, results) {
        template.page = 1;
        template.users.set(results);
    });
    Meteor.call('users.admin_stats', function(error, results) {
        template.userstats.set(results);
    });
    Meteor.call('partups.admin_stats', function(error, results) {
        template.partupstats.set(results);
    });
    Meteor.call('users.admin_get_accepted_impersonation_requests', (error, result) => {
      if (result) {
        template.acceptedImpersonationRequests = result;
      }
    });

});

Template.Admin.helpers({
    users: function() {
        var users = Template.instance().users.get();
        const impersonationRequests = Template.instance().acceptedImpersonationRequests;
        const withImpersonationRequest = _.reduce(users, (total, user) => {
          const impersonationRequest = _.find(impersonationRequests, ({ userId }) => userId === user._id);

          if (impersonationRequest) {
            user.impersonationRequest = impersonationRequest;
          }

          total.push(user);
          return total;
        }, []);
        return users;
    },
    isActiveImpersonationRequest(request) {
      const { impersonation } = Partup.helpers;
      return impersonation.isActive(request);
    },
    userStats: function() {
        return Template.instance().userstats.get();
    },
    partupStats: function() {
        return Template.instance().partupstats.get();
    },
    getMail: function(user) {
        return User(user).getEmail();
    },
    getToken: function() {
        return Accounts._storedLoginToken();
    },
    isUserActive: function(user) {
        return User(user).isActive();
    },
    isUserInvited: function(user) {
        return User(user).isInvited();
    },
});

Template.Admin.events({
    'click [data-toggle]': function(event) {
        event.preventDefault();
        $(event.currentTarget).next('[data-toggle-target]').toggleClass('pu-state-active');
        $('[data-toggle-target]').not($(event.currentTarget).next('[data-toggle-target]')[0]).removeClass('pu-state-active');
    },
    'click [data-expand]': function(event) {
        $(event.currentTarget).addClass('pu-state-expanded');
    },
    'submit .usersearch': function(event, template) {
        event.preventDefault();
        template.page = 0;
        var query = template.find('[data-usersearchfield]').value;
        Meteor.call('users.admin_all', {
            'profile.name': {$regex: query, $options: 'i'}
        },{
            limit: 100,
            page: template.page
        }, function(error, results) {
            template.users.set(results);
        });
    },
    'click [data-showmore]': function(event, template) {
        Meteor.call('users.admin_all', {}, {
            page: template.page,
            limit: template.limit
        }, function(error, results) {
            var currentUsers = template.users.get();
            var newUserList = currentUsers.concat(results);
            template.users.set(newUserList);
            template.page++;
        });
    },
    'click [data-deactivate-user]': function(event, template) {
        event.preventDefault();
        var userId = this._id;
        var self = this;

        Partup.client.prompt.confirm({
            onConfirm: function() {
                Meteor.call('users.deactivate', userId, function(error, result) {
                    if (error) {
                        Partup.client.notify.error(TAPi18n.__(error));
                        return;
                    }
                    Partup.client.notify.success('user deactivated');
                    $(event.currentTarget).closest('[data-userr]').addClass('pu-state-archived');
                });
            }
        });
    },
    'click [data-request-impersonation]'(event) {
      event.preventDefault();
      const userId = this._id;

      Meteor.call('users.admin_get_accepted_impersonation_requests', (error, result) => {
        for (let req of result) {
          if (req.userId === userId) {
            Partup.client.notify.info('There is an accepted request for this user, please refresh the page');
            return;
          }
        }
        Meteor.call('users.admin_request_impersonation', userId, (error, result) => {
          if (error) {
            Partup.client.notify.error(error.details);
          } else if (result === 1) {
            Partup.client.notify.info('Impersonation request successful, please ask the user to refresh their advanced profile tab');
          } else {
            Partup.client.notify.info('something went wrong with the impersonation request');
          }
        });
      });
    },
    'click [data-impersonate-user]': function(event, template) {
      event.preventDefault();
      var userId = this._id;
      Meteor.call('users.admin_impersonate', userId, function(error, timeLeft) {
        if (error) {
          Partup.client.notify.error(TAPi18n.__(error.reason));
          return;
        }

        if (timeLeft > 0) {
          Meteor.setTimeout(() => {
            Meteor.connection.setUserId(Meteor.userId());
          }, impersonation.durationMS);

          Meteor.connection.setUserId(userId);
          Intent.go({route: 'home'});
        } else {
          Partup.client.notify.error(TAPi18n.__(`impersonation-error-not-active`));
        }
      });
    },
    'click [data-reactivate-user]': function(event, template) {
        event.preventDefault();
        var userId = this._id;

        Partup.client.prompt.confirm({
            onConfirm: function() {
                Meteor.call('users.reactivate', userId, function(error, result) {
                    if (error) {
                        Partup.client.notify.error(TAPi18n.__(error));
                        return;
                    }
                    Partup.client.notify.success('user reactivated');
                    $(event.currentTarget).closest('[data-userr]').removeClass('pu-state-archived');
                });
            }
        });
    }
});
