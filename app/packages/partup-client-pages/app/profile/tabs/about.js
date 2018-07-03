Template.app_profile_about.onCreated(function() {
    var template = this;
    template.loading = new ReactiveVar(true);

    // Column layout
    template.columnTilesLayout = new Partup.client.constructors.ColumnTilesLayout({

        // Initial amount of columns
        columnMinWidth: 400,
        maxColumns: 2,

        // This function will be called for each tile
        calculateApproximateTileHeight: function(tileData, columnWidth) {
            // The goal of this formula is to approach
            // the expected height of a tile as best
            // as possible, synchronously,
            // using the given partup object
            return 1000;
        }

    });

    var profileId = template.data.profileId;

    template.subscribe('tiles.profile', profileId, {
        onReady: function() {
            var tiles = Tiles.find({upper_id: profileId}).fetch();
            var user = Meteor.users.findOne({_id: profileId});
            var displayTiles = [];

            var profileIsCurrentUser = !!(Meteor.userId() === profileId);
            var profilehasMediaTiles = !!(tiles && tiles.length);

            if (!profilehasMediaTiles && profileIsCurrentUser) {
                displayTiles = displayTiles.concat([{
                    type: 'image',
                    placeholder: true,
                }]);
            }

            displayTiles = displayTiles.concat(tiles || []);

            template.columnTilesLayout.addTiles(displayTiles, function() {
                template.loading.set(false);
            });
        }

    });
});

Template.app_profile_about.helpers({
    data: function() {
        var template = Template.instance();
        var profileId = this.profileId;

        return {
            columnTilesLayout: function() {
                return template.columnTilesLayout;
            },
            firstname: function() {
                var user = Meteor.users.findOne(profileId);
                return User(user).getFirstname();
            },
            profileIsCurrentUser: function() {
                return profileId === Meteor.userId();
            },
            loading: function() {
                return template.loading.get();
            }
        };
    },
    translations: function() {
        var profileId = this.profileId;
        var user = Meteor.users.findOne(profileId);

        return {
            firstname: function() {
                return TAPi18n.__('pages-app-profile-about-name', {
                    name: User(user).getFirstname(),
                });
            },
        };
    },
});

Template.app_profile_about.events({
    'click [data-create-tile]': function(event, template) {
        event.preventDefault();
        var type = $(event.currentTarget).closest('[data-create-tile]').data('create-tile');
        Partup.client.popup.open({
            id: 'new-' + type
        }, function(result) {
            template.refresh();
        });
    },
    'click [data-delete]': function(event, template) {
        event.preventDefault();
        var tile = this;
        var tileId = tile._id;
        Partup.client.prompt.confirm({
            title: TAPi18n.__('pages-app-profile-about-tile-prompt-title'),
            message: TAPi18n.__('pages-app-profile-about-tile-prompt-message'),
            onConfirm: function() {
                Meteor.call('tiles.remove', tileId, function(error, result) {
                    if (error) {
                        Partup.client.notify.error(TAPi18n.__(error));
                        return;
                    }
                    Partup.client.notify.success('Tile removed');
                    template.refresh();
                });
            }
        });
    }

});
