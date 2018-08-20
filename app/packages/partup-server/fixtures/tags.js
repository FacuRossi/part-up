Meteor.startup(function() {
  if (process.env.NODE_ENV.match(/development|staging/)) {
    if (!Tags.find().count()) {

            // Tags.insert({
            //     '_id' : 'crowdfunding'
            // });

            // /* 2 */
            // Tags.insert({
            //     '_id' : 'marketing'
            // });

            // /* 3 */
            // Tags.insert({
            //     '_id' : 'part-up'
            // });

            // /* 4 */
            // Tags.insert({
            //     '_id' : 'geld'
            // });

            // /* 5 */
            // Tags.insert({
            //     '_id' : 'design'
            // });

            // /* 6 */
            // Tags.insert({
            //     '_id' : 'ux'
            // });

            // /* 7 */
            // Tags.insert({
            //     '_id' : 'photography'
            // });

            // /* 8 */
            // Tags.insert({
            //     '_id' : 'nonprofit'
            // });

            // /* 9 */
            // Tags.insert({
            //     '_id' : 'ing'
            // });

            // /* 10 */
            // Tags.insert({
            //     '_id' : 'financial'
            // });

            // /* 11 */
            // Tags.insert({
            //     '_id' : 'organizational'
            // });

            // /* 12 */
            // Tags.insert({
            //     '_id' : 'lifely'
            // });

            // /* 13 */
            // Tags.insert({
            //     '_id' : 'meetup'
            // });

            // /* 14 */
            // Tags.insert({
            //     '_id' : 'meteor'
            // });
    }
  }
});
