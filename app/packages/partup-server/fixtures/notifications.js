Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!Notifications.find().count()) {

            /* 1 */
            // Notifications.insert({
            //     '_id' : 'zBWjQJLbB3s6XJbi7',
            //     'for_upper_id' : 'K5c5M4Pbdg3B82wQH',
            //     'type' : 'partups_supporters_added',
            //     'type_data' : {
            //         'partup' : {
            //             '_id': 'gJngF65ZWyS9f3NDE',
            //             'name' : 'Crowd funding Part-up organiseren',
            //             'slug' : 'crowd-funding-part-up-organiseren-gJngF65ZWyS9f3NDE'
            //         },
            //         'supporter' : {
            //             '_id' : 'K5c5M4Pbdg3B82wQI',
            //             'name' : 'John Partup',
            //             'image' : 'cHhjpWKo9DHjXQQjy'
            //         }
            //     },
            //     'created_at' : new Date('2015-07-21T14:08:02.831Z'),
            //     'new' : true,
            //     'clicked': false
            // });

        }
    }
});
