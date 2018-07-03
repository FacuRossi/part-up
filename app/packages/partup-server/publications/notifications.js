Meteor.publishComposite('notifications.for_upper', function(limit, mobile = false) {
    check(limit, Number);
    this.unblock();

    var user = Meteor.users.findOne(this.userId);
    if (!user) return;

    let notificationCursor;
    if (mobile) {
      notificationCursor = Notifications.findForUserForMobile(user, {}, { limit });
    } else {
      notificationCursor = Notifications.findForUser(user, {}, { limit });
    }

    return {
        find: function() {
            return notificationCursor;
        },
        children: [
            {find: Images.findForNotification}
        ]
    };
});

Meteor.publishComposite('notifications.for_upper.by_id', function(notificationId) {
    check(notificationId, String);
    this.unblock();

    var user = Meteor.users.findOne(this.userId);
    if (!user) return;

    return {
        find: function() {
            return Notifications.findForUser(user, {_id: notificationId});
        },
        children: [
            {find: Images.findForNotification}
        ]
    };
});
