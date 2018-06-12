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

});

Template.Admin.helpers({
    users: function() {
        var users = Template.instance().users.get();
        return users;
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
          }, timeLeft);

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
