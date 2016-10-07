/**
 * Generate an Update in a Partup when there is a new Upper.
 */
Event.on('partups.uppers.inserted', function(partupId, upperId) {
    var updateType = 'partups_uppers_added';
    var updateTypeData = {};

    var update = Partup.factories.updatesFactory.make(upperId, partupId, updateType, updateTypeData);

    // TODO: Validation

    Updates.insert(update);
});

/**
 * Generate a notification for all partners when an upper makes a request
 */
Event.on('partups.partner_requested', function(requester, partup, updateId) {
    // Set base options
    var notificationOptions = {
        type: 'partups_partner_request',
        typeData: {
            requester: {
                _id: requester._id,
                name: requester.profile.name,
                image: requester.profile.image
            },
            partup: {
                _id: partup._id,
                name: partup.name,
                slug: partup.slug
            },
            update: {
                _id: updateId
            }
        }
    };

    // Send to all partners
    partup.uppers.forEach(function(partnerId) {
        notificationOptions.userId = partnerId;
        //Partup.server.services.notifications.send(notificationOptions);
    });
});


/**
 * Generate a notification for an upper when getting accepted as partner
 */
Event.on('partups.partner_request.accepted', function(accepter, partup, upperId, updateId) {
    var notificationOptions = {
        userId: upperId,
        type: 'partups_partner_accepted',
        typeData: {
            accepter: {
                _id: accepter._id,
                name: accepter.profile.name,
                image: accepter.profile.image
            },
            partup: {
                _id: partup._id,
                name: partup.name,
                slug: partup.slug
            },
            update: {
                _id: updateId
            }
        }
    };

    //Partup.server.services.notifications.send(notificationOptions);
});


/**
 * Generate a notification for an upper when getting rejected as partner
 */
Event.on('partups.partner_request.rejected', function(rejecter, partupId, upperId, updateId) {
    var partup = Partups.findOneOrFail(partupId);

    var notificationOptions = {
        userId: upperId,
        type: 'partups_partner_rejected',
        typeData: {
            rejecter: {
                _id: rejecter._id,
                name: rejecter.profile.name,
                image: rejecter.profile.image
            },
            partup: {
                _id: partup._id,
                name: partup.name,
                slug: partup.slug
            },
            update: {
                _id: updateId
            }
        }
    };

    //Partup.server.services.notifications.send(notificationOptions);
});