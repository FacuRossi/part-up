/**
 * Generate Updates and Notifications in a Partup when there is a new Supporter.
 */
Event.on('partups.supporters.inserted', function(partup, upper) {
    // Generate Update
    var updateType = 'partups_supporters_added';
    var updateTypeData = {};
    var existingUpdate = Updates.findOne({
        type: updateType,
        partup_id: partup._id,
        upper_id: upper._id
    }, {_id: 1});

    // Update the update if one exists
    if (existingUpdate) {
        Updates.update(existingUpdate._id, {$set: {updated_at: new Date}});
        Partup.server.services.system_messages.send(upper, existingUpdate._id, 'system_supporters_added');
        return;
    }

    var update = Partup.factories.updatesFactory.make(upper._id, partup._id, updateType, updateTypeData);
    var updateId = Updates.insert(update);

    // Generate a Notification for each upper in a Partup when there is a new Supporter.
    var notificationOptions = {
        type: 'partups_supporters_added',
        typeData: {
            supporter: {
                _id: upper._id,
                name: upper.profile.name,
                image: upper.profile.image
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

    if (partup.uppers) {
        partup.uppers.forEach(function(upperId) {
            notificationOptions.userId = upperId;

            Partup.server.services.notifications.send(notificationOptions);
        });
    }

});

/**
 * Update the Update in a Partup when a Supporter stops supporting.
 */
Event.on('partups.supporters.removed', function(partup, upper) {
    var updateType = 'system_supporters_removed';
    var existingUpdate = Updates.findOne({
        type: updateType,
        partup_id: partup._id,
        upper_id: upper._id
    }, {_id: 1});

    // Update the update if one exists
    if (existingUpdate) {
        Updates.update(existingUpdate._id, {$set: {updated_at: new Date}});
        Partup.server.services.system_messages.send(upper, existingUpdate._id, 'system_supporters_removed');
        return;
    }

    var update = Partup.factories.updatesFactory.make(upper._id, partup._id, updateType, {});
    Updates.insert(update);
});

