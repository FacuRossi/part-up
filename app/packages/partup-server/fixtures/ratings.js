Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {

        if (!Ratings.find().count()) {

            // Ratings.insert({
            //     '_id' : 'qRckrxhXHWTsgwFcu',
            //     'created_at' : new Date('2015-07-21T14:09:50.895Z'),
            //     'partup_id' : 'gJngF65ZWyS9f3NDE',
            //     'activity_id' : 'ruvTupX9WMmqFTLuL',
            //     'contribution_id' : 'yZ42ydeKrXCfGsjXo',
            //     'rating' : 79,
            //     'feedback' : 'Very nice work John!',
            //     'upper_id' : 'K5c5M4Pbdg3B82wQH',
            //     'rated_upper_id' : 'K5c5M4Pbdg3B82wQI',
            //     'updated_at' : new Date('2015-07-21T14:10:00.389Z')
            // });
        }
    }
});
