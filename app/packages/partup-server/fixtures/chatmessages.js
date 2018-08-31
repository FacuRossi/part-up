Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!ChatMessages.find().count()) {

          // ChatMessages.insert({
          //   _id: '',
          //   content: '',
          //   created_at: new Date(),

          //   chat_id: '',
          //   creator_id: '',

          //   read_by: [],
          //   seen_by: [],
          //   updated_at: new Date()
          // });

        }
    }
});
