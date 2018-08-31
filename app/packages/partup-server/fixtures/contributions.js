Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!Contributions.find().count()) {

          // Contributions.insert({
          //   _id: '',
          //   hours: 0,
          //   rate: 0,
          //   verified: true,
          //   created_at: new Date(),

          //   upper_id: '',
          //   partup_id: '',
          //   update_id: '',
          //   activity_id: '',

          //   updated_at: new Date()
          // });

        }
    }
});
