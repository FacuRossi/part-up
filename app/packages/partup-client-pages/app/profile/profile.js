import { authorization } from 'meteor/partup-lib';

Template.app_profile.onCreated(function() {
    var template = this;

    template.autorun(function() {
        const { profileId } = Template.currentData();
        if (profileId) {
          template.subscribe('users.one', profileId, {
            onReady() {
              user = Meteor.users.findOne(profileId);

              if (!authorization.checkCanSeeProfile(Meteor.user(), user)) {
                Router.pageNotFound('profile');
              }

              var isViewable = User(user).aboutPageIsViewable();
              if (!isViewable && Router.current().route.getName() === 'profile') {
                  Router.replaceYieldTemplate('app_profile_upper_partups', 'app_profile');
              }
            }
          });
        }
    });

    template.autorun(function() {
        var scrolled = Partup.client.scroll.pos.get() > 100;
        if (scrolled) {
            if (template.view.isRendered) template.toggleExpandedText(true);
        }
    });

    template.hide = true;

    template.toggleExpandedText = function(hide) {
        var clickedElement = $('[data-expand]');
        if (!clickedElement || !clickedElement[0]) return;
        var parentElement = $(clickedElement[0].parentElement);
        var collapsedText = TAPi18n.__(clickedElement.data('collapsed-key')) || false;
        var expandedText = TAPi18n.__(clickedElement.data('expanded-key')) || false;

        if (parentElement.hasClass('pu-state-open')) {
            if (collapsedText) clickedElement.html(collapsedText);
        } else {
            if (expandedText) clickedElement.html(expandedText);
        }
        if (hide) {
            if (collapsedText) clickedElement.html(collapsedText);
            parentElement.removeClass('pu-state-open');
            clickedElement.parents('.pu-sub-pageheader').removeClass('pu-state-descriptionexpanded');
        } else {
            parentElement.toggleClass('pu-state-open');
            clickedElement.parents('.pu-sub-pageheader').toggleClass('pu-state-descriptionexpanded');
        }

        template.hide = hide;
    };
});

/*************************************************************/
/* Page helpers */
/*************************************************************/
Template.app_profile.helpers({
    profile: function() {
        var data = Template.currentData();
        var profile = Meteor.users.findOne({_id: data.profileId});
        if (!profile) return;

        return {
            data: profile.profile,
            hasAboutSection: function() {
                return User(profile).aboutPageIsViewable();
            },
            online: function() {
                if (!profile.status) return false;
                return profile.status.online;
            },
            profileId: function() {
                return data.profileId;
            },
            firstname: function() {
                return User(profile).getFirstname();
            },
            roundedScore: function() {
                return User(profile).getReadableScore();
            },
            hasTilesOrIsCurrentUser: function() {
                var viewable = User(pofile).aboutPageIsViewable();
                return viewable;
            },
            chatIdWithCurrentUser: function() {
                return (Chats.findForUser(Meteor.userId(), {private: true}) || [])
                    .map(function(chat) {
                        return chat._id;
                    })
                    .filter(function(chatId) {
                        var chats = profile.chats || [];
                        return chats.indexOf(chatId) > -1;
                    })
                    .pop();
            },
            startChatQuery: function() {
                return 'user_id=' + data.profileId;
            }
        };
    },

    selectorSettings: function() {
        var data = Template.currentData();
        var profile = Meteor.users.findOne({_id: data.profileId});
        if (!profile) return false;

        return {
            _id: data.profileId,
            currentRoute: Router.current().route.getName(),
            firstName: User(profile).getFirstname()
        };
    },

    shrinkHeader: function() {
        return Partup.client.scroll.pos.get() > 100;
    },
    textHasOverflown: function() {
        var template = Template.instance();
        var rendered = template.partupTemplateIsRendered.get();
        if (!rendered) return;
        var expander = $(template.find('[data-expander-parent]'));
        if (expander.length && expander[0].scrollHeight > expander.innerHeight()) return true;
        return false;
    }
});

/*************************************************************/
/* Page events */
/*************************************************************/
Template.app_profile.events({
    'click [data-expand]': function(event, template) {
        event.preventDefault();
        template.toggleExpandedText(!template.hide);
    },
    'click [data-open-profilesettings]': function(event, template) {
        event.preventDefault();
        Intent.go({
            route: 'profile-settings',
            params: {
                _id: template.data.profileId
            }
        });
    },
    'click [data-location]': function(event, template) {
        event.preventDefault();
        var location = Meteor.users.findOne(template.data.profileId).profile.location;
        Partup.client.discover.setPrefill('locationId', location.place_id);
        Partup.client.discover.setCustomPrefill('locationLabel', location.city);
        Router.go('discover');
    }
});
