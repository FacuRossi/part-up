Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!Activities.find().count()) {

            // Activities.insert({
            //     _id: '',
            //     name: '',
            //     description: '',
            //     archived: false
            //     end_date: new Date(),

            //     creator_id: '',
            //     partup_id: '',
            //     update_id: '',
            //     lane_id: '',

            //     created_at: new Date(),
            //     updated_at: new Date(),
            // });

        }
    }
});
