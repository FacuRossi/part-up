Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!Invites.find().count()) {

          // Invites.insert({
          //   _id: '',
          //   type: '',
          //   created_at: new Date(),

          //   activity_id: '',
          //   inviter_id: '',
          //   invitee_id: '',
          // });

        }
    }
});
