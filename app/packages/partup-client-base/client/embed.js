import { authorization } from 'meteor/partup-lib';

/**
 * Embed helpers
 *
 * @class embed
 * @memberof Partup.client
 */
Partup.client.embed = {
    partup: function(partup, images, networks, users) {
        var embed = this;

        // Add upperObjects to partup
        if (partup.uppers) {
          partup.upperObjects = partup.uppers.map(function(userId) {
            var upper = mout.object.find(users, {_id: userId});

            if (
              upper
              && (
                authorization.checkCanSeeProfile(Meteor.user(), upper)
              )
            ) {
              embed.user(upper, images);
              return upper;
            }
          }).filter(x => x);
        }

        // Add partup image to partup
        if (partup.image) {
            partup.imageObject = mout.object.find(images, {_id: partup.image});
        }

        // Add network object to partup
        if (partup.network_id) {
            partup.networkObject = mout.object.find(networks, {_id: partup.network_id});

            // Embed network
            if (partup.networkObject) {
                embed.network(partup.networkObject, images, users);
            }
        }

        return partup
    },
    network: function(network, images, users) {
        var embed = this;

        if (network.most_active_uppers) {
            network.mostActiveUpperObjects = network.most_active_uppers.map(function(userId) {
                var upper = mout.object.find(users, {_id: userId});

                if (upper
                  && (
                    authorization.checkCanSeeProfile(Meteor.user(), upper)
                  )
                ) {
                  embed.user(upper, images);
                  return upper;
                }
            }).filter(x => x);
        }

        // Add network iconObject
        if (network.background_image) {
            network.backgroundImageObject = mout.object.find(images, {_id: network.background_image});
        }

        // Add network iconObject
        if (network.icon) {
            network.iconObject = mout.object.find(images, {_id: network.icon});
        }

        // Add network logoObject
        if (network.logo) {
            network.logoObject = mout.object.find(images, {_id: network.logo});
        }

        // Add network imageObject
        if (network.image) {
            network.imageObject = mout.object.find(images, {_id: network.image});
        }

        return network
    },
    user: function(user, images) {

        // Add imageObject to user image
        if (get(user, 'profile.image')) {
            user.profile.imageObject = mout.object.find(images, {_id: user.profile.image});
        }

    }
};
