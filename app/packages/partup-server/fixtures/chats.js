Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!Chats.find().count()) {

            /*
             * Chat for PUBLIC TRIBE
            **/
            Chats.insert({
                _id: 'fMpNncPh4Qua6NANH',
                'created_at' : new Date('2015-07-21T15:47:33.225Z'),
                'updated_at' : new Date('2015-07-21T15:47:33.225Z'),
                started_typing: [],
                counter: []
            });

            /*
             * Chat for INVITE TRIBE
             **/
            Chats.insert({
                _id: 'JSGpNRF5R3gjEWcGf',
                'created_at' : new Date('2015-07-21T15:47:33.225Z'),
                'updated_at' : new Date('2015-07-21T15:47:33.225Z'),
                started_typing: [],
                counter: []
            });

            /*
             * Chat for CLOSED TRIBE
             **/
            Chats.insert({
                _id: '9nTogbMy6Ddjfh6NP',
                'created_at' : new Date('2015-07-21T15:47:33.225Z'),
                'updated_at' : new Date('2015-07-21T15:47:33.225Z'),
                started_typing: [],
                counter: []
            });

      //       /* 4 */
      //       Chats.insert({
      //           _id: 'wioZDD9bTkT2eDF4c',
      //           'created_at' : new Date('2015-07-21T15:47:33.225Z'),
      //           'updated_at' : new Date('2015-07-21T15:47:33.225Z'),
      //           started_typing: [],
      //           counter: []
      //       });

      //       /* 5 */
      //       Chats.insert({
      //           _id: '9yscDD9bTkT2eDF4c',
      //           'created_at' : new Date('2015-07-21T15:47:33.225Z'),
      //           'updated_at' : new Date('2015-07-21T15:47:33.225Z'),
      //           started_typing: [],
      //           counter: []
      //       });

      //       /* 6 */
      //       Chats.insert({
      //           _id: 'e6qqFXCFTrE5TNHbE',
      //           'created_at' : new Date('2015-07-21T15:47:33.225Z'),
      //           'updated_at' : new Date('2015-07-21T15:47:33.225Z'),
      //           started_typing: [],
      //           counter: []
      //       });

			// /* 6 */
      //       Chats.insert({
      //           _id: 'AZvyQ3qiSGjuuW5Am',
      //           'created_at' : new Date('2015-07-21T15:47:33.225Z'),
      //           'updated_at' : new Date('2015-07-21T15:47:33.225Z'),
      //           started_typing: [],
      //           counter: []
      //       });
        }
    }
});
