Meteor.startup(function() {
  if (process.env.NODE_ENV.match(/development|staging/)) {
    if (!Updates.find().count()) {
            // //First partup
            // /* 1 */
            // Updates.insert({
            //     '_id' : 'ZpxagHRXEZzxqnEtx',
            //     'upper_id' : 'K5c5M4Pbdg3B82wQH',
            //     'partup_id' : 'gJngF65ZWyS9f3NDE',
            //     'type' : 'partups_created',
            //     'type_data' : {},
            //     'comments_count' : 0,
            //     'created_at' : new Date('2015-07-21T14:03:19.990Z'),
            //     'updated_at' : new Date('2015-07-21T14:03:19.990Z')
            // });

            // /* 2 */
            // Updates.insert({
            //     '_id' : 'Mq83xei2S62HNNRHH',
            //     'upper_id' : null,
            //     'partup_id' : 'gJngF65ZWyS9f3NDE',
            //     'system' : true,
            //     'type' : 'partups_message_added',
            //     'type_data' : {
            //         'type' : 'welcome_message'
            //     },
            //     'comments_count' : 0,
            //     'created_at' : new Date('2015-07-21T14:03:19.995Z'),
            //     'updated_at' : new Date('2015-07-21T14:03:19.995Z')
            // });

            // /* 3 */
            // for (var hour = 10; hour < 22; hour++) {
            //     for (var minute = 10; minute < 22; minute++) {
            //         var comments = [];
            //         var last_comment_time;
            //         for (var i = 1; i <= 3; i++) {
            //             var comment_time = new Date('2015-07-21T' + hour + ':' + (minute + i) + ':20.000Z');
            //             last_comment_time = comment_time;
            //             comments.push({
            //                 '_id' : 'gX9ZDAfsgkaZFPag' + i,
            //                 'content' : 'Comment on a message, nr ' + i,
            //                 'type' : null,
            //                 'creator' : {
            //                     '_id' : 'K5c5M4Pbdg3B82wQI',
            //                     'name' : 'John Partup',
            //                     'image' : 'nL2MYYXJ3eFeb2GYq'
            //                 },
            //                 'created_at' : comment_time,
            //                 'updated_at' : comment_time
            //             });
            //         }
            //         Updates.insert({
            //             '_id' : 'BWQzehWhCX5ZT' + hour + minute,
            //             'partup_id' : 'gJngF65ZWyS9f3NDE',
            //             'type_data' : {
            //                 'new_value' : 'Message nr [ ' + hour + ', ' + minute + ']',
            //                 'images' : []
            //             },
            //             'comments_count' : 3,
            //             'upper_id' : 'K5c5M4Pbdg3B82wQH',
            //             'created_at' : new Date('2015-07-21T' + hour + ':' + minute + ':20.000Z'),
            //             'updated_at' : last_comment_time,
            //             'type' : 'partups_message_added',
            //             'comments' : comments
            //         });
            //     };
            // };

            // /* 4 */
            // Updates.insert({
            //     '_id' : 'Wjtg7f6TqX78qPZ68',
            //     'upper_id' : 'K5c5M4Pbdg3B82wQI',
            //     'partup_id' : 'gJngF65ZWyS9f3NDE',
            //     'type' : 'partups_supporters_added',
            //     'type_data' : {},
            //     'comments_count' : 0,
            //     'created_at' : new Date('2015-07-21T14:08:02.827Z'),
            //     'updated_at' : new Date('2015-07-21T14:08:02.827Z')
            // });

            // /* 5 */
            // Updates.insert({
            //     '_id' : '5BDYurmbYkiFbNho4',
            //     'upper_id' : 'K5c5M4Pbdg3B82wQH',
            //     'partup_id' : 'gJngF65ZWyS9f3NDE',
            //     'type' : 'partups_ratings_changed',
            //     'type_data' : {
            //         'activity_id' : 'ruvTupX9WMmqFTLuL',
            //         'contribution_id' : 'yZ42ydeKrXCfGsjXo',
            //         'rating_id' : 'qRckrxhXHWTsgwFcu'
            //     },
            //     'comments_count' : 0,
            //     'created_at' : new Date('2015-07-21T14:09:28.476Z'),
            //     'updated_at' : new Date('2015-07-21T14:10:00.404Z')
            // });

            // /* 6 */
            // Updates.insert({
            //     '_id' : 'fWNZE2Xmd2KeQBWJK',
            //     'upper_id' : 'K5c5M4Pbdg3B82wQI',
            //     'partup_id' : 'gJngF65ZWyS9f3NDE',
            //     'type' : 'partups_uppers_added',
            //     'type_data' : {},
            //     'comments_count' : 0,
            //     'created_at' : new Date('2015-07-21T14:09:44.627Z'),
            //     'updated_at' : new Date('2015-07-21T14:09:44.627Z')
            // });

            // /* 7 */
            // Updates.insert({
            //     '_id' : 'rqAFPrKayDd8Ko6YK',
            //     'upper_id' : 'K5c5M4Pbdg3B82wQI',
            //     'partup_id' : 'gJngF65ZWyS9f3NDE',
            //     'type' : 'partups_activities_comments_added',
            //     'type_data' : {
            //         'activity_id' : 'ruvTupX9WMmqFTLuL'
            //     },
            //     'comments_count' : 4,
            //     'created_at' : new Date('2015-07-21T14:03:49.141Z'),
            //     'updated_at' : new Date('2015-07-21T14:09:28.443Z'),
            //     'comments' : [
            //         {
            //             '_id' : 'tPakKpxTBLTnNRhEy',
            //             'content' : 'Im known with these kind of platforms, it would be a perfect fit',
            //             'type' : 'motivation',
            //             'creator' : {
            //                 '_id' : 'K5c5M4Pbdg3B82wQI',
            //                 'name' : 'John Partup',
            //                 'image' : 'nL2MYYXJ3eFeb2GYq'
            //             },
            //             'created_at' : new Date('2015-07-21T14:09:28.442Z'),
            //             'updated_at' : new Date('2015-07-21T14:09:28.442Z')
            //         },
            //         {
            //             '_id' : 'DazsZWrkJr8nvYdhd',
            //             'content' : 'system_contributions_proposed',
            //             'type' : 'system',
            //             'creator' : {
            //                 '_id' : 'K5c5M4Pbdg3B82wQI',
            //                 'name' : 'John Partup'
            //             },
            //             'created_at' : new Date('2015-07-21T14:09:28.491Z'),
            //             'updated_at' : new Date('2015-07-21T14:09:28.491Z')
            //         },
            //         {
            //             '_id' : 'SZRMLnpTrqYA89Mot',
            //             'content' : 'system_contributions_accepted',
            //             'type' : 'system',
            //             'creator' : {
            //                 '_id' : 'K5c5M4Pbdg3B82wQH',
            //                 'name' : 'Default User'
            //             },
            //             'created_at' : new Date('2015-07-21T14:09:44.632Z'),
            //             'updated_at' : new Date('2015-07-21T14:09:44.632Z')
            //         },
            //         {
            //             '_id' : 'zLnzvPTg4r8CPyhJx',
            //             'content' : 'system_ratings_inserted',
            //             'type' : 'system',
            //             'creator' : {
            //                 '_id' : 'K5c5M4Pbdg3B82wQH',
            //                 'name' : 'Default User'
            //             },
            //             'created_at' : new Date('2015-07-21T14:09:50.919Z'),
            //             'updated_at' : new Date('2015-07-21T14:09:50.919Z')
            //         }
            //     ]
            // });

            // /* 8 */
            // Updates.insert({
            //     '_id' : 'hvL6bnH5ckaA599d4',
            //     'upper_id' : 'a7qcp5RHnh5rfaeW9',
            //     'partup_id' : 'gJngF65ZWyS9f3NDE',
            //     'type' : 'partups_activities_comments_added',
            //     'type_data' : {
            //         'activity_id' : 'SYwR9AHWc7AKsfMrv'
            //     },
            //     'comments_count' : 2,
            //     'created_at' : new Date('2015-07-21T14:03:57.906Z'),
            //     'updated_at' : new Date('2015-07-21T14:11:51.704Z'),
            //     'comments' : [
            //         {
            //             '_id' : 'cMPLeKqdH3j84ocZ5',
            //             'content' : 'Ive written quite a few of these before, let me do it!',
            //             'type' : 'motivation',
            //             'creator' : {
            //                 '_id' : 'a7qcp5RHnh5rfaeW9',
            //                 'name' : 'Judy Partup',
            //                 'image' : 'LG9J5XA4PPg5B8ZNu'
            //             },
            //             'created_at' : new Date('2015-07-21T14:11:51.703Z'),
            //             'updated_at' : new Date('2015-07-21T14:11:51.703Z')
            //         },
            //         {
            //             '_id' : 'ZFHwPcstE3vbcuFDt',
            //             'content' : 'system_contributions_proposed',
            //             'type' : 'system',
            //             'creator' : {
            //                 '_id' : 'a7qcp5RHnh5rfaeW9',
            //                 'name' : 'Judy Partup'
            //             },
            //             'created_at' : new Date('2015-07-21T14:11:51.996Z'),
            //             'updated_at' : new Date('2015-07-21T14:11:51.996Z')
            //         }
            //     ]
            // });

            // /* 9 */
            // Updates.insert({
            //     '_id' : 'cSrhFNj9egtsbcAZM',
            //     'upper_id' : 'a7qcp5RHnh5rfaeW9',
            //     'partup_id' : 'gJngF65ZWyS9f3NDE',
            //     'type' : 'partups_supporters_added',
            //     'type_data' : {},
            //     'comments_count' : 0,
            //     'created_at' : new Date('2015-07-21T14:11:51.758Z'),
            //     'updated_at' : new Date('2015-07-21T14:11:51.758Z')
            // });

            // /* 10 */
            // Updates.insert({
            //     '_id' : 'AttwbATkJYcTeNtHz',
            //     'upper_id' : 'a7qcp5RHnh5rfaeW9',
            //     'partup_id' : 'gJngF65ZWyS9f3NDE',
            //     'type' : 'partups_contributions_proposed',
            //     'type_data' : {
            //         'activity_id' : 'SYwR9AHWc7AKsfMrv',
            //         'contribution_id' : '4GggDMBiHz44afReM'
            //     },
            //     'comments_count' : 0,
            //     'created_at' : new Date('2015-07-21T14:11:51.960Z'),
            //     'updated_at' : new Date('2015-07-21T14:11:51.960Z')
            // });

            // /* 11 */
            // Updates.insert({
            //     '_id' : 'uHf3ZxiK57rRQMqqg',
            //     'upper_id' : 'K5c5M4Pbdg3B82wQI',
            //     'partup_id' : 'CJETReuE6uo2eF7eW',
            //     'type' : 'partups_created',
            //     'type_data' : {},
            //     'comments_count' : 0,
            //     'created_at' : new Date('2015-07-22T09:26:51.376Z'),
            //     'updated_at' : new Date('2015-07-22T09:26:51.376Z')
            // });

            // /* 12 */
            // Updates.insert({
            //     '_id' : 'AFsgqhFAnyruXC5bQ',
            //     'upper_id' : null,
            //     'partup_id' : 'CJETReuE6uo2eF7eW',
            //     'system' : true,
            //     'type' : 'partups_message_added',
            //     'type_data' : {
            //         'type' : 'welcome_message'
            //     },
            //     'comments_count' : 0,
            //     'created_at' : new Date('2015-07-22T09:26:51.377Z'),
            //     'updated_at' : new Date('2015-07-22T09:26:51.377Z')
            // });

            // /* 13 */
            // Updates.insert({
            //     '_id' : '9S6sskRnudTefQXrs',
            //     'upper_id' : 'K5c5M4Pbdg3B82wQH',
            //     'partup_id' : 'ASfRYBAzo2ayYk5si',
            //     'type' : 'partups_created',
            //     'type_data' : {},
            //     'comments_count' : 0,
            //     'created_at' : new Date('2015-07-22T09:38:22.622Z'),
            //     'updated_at' : new Date('2015-07-22T09:38:22.622Z')
            // });

            // /* 14 */
            // Updates.insert({
            //     '_id' : '5KyKiFf3ZyKeepX8S',
            //     'upper_id' : null,
            //     'partup_id' : 'ASfRYBAzo2ayYk5si',
            //     'system' : true,
            //     'type' : 'partups_message_added',
            //     'type_data' : {
            //         'type' : 'welcome_message'
            //     },
            //     'comments_count' : 0,
            //     'created_at' : new Date('2015-07-22T09:38:22.627Z'),
            //     'updated_at' : new Date('2015-07-22T09:38:22.627Z')
            // });

            // /* 15 */
            // Updates.insert({
            //     '_id' : '5H5BdQxxgdTQotgCq',
            //     'upper_id' : 'a7qcp5RHnh5rfaeW9',
            //     'partup_id' : 'vGaxNojSerdizDPjb',
            //     'type' : 'partups_created',
            //     'type_data' : {},
            //     'comments_count' : 0,
            //     'created_at' : new Date('2015-07-22T09:42:13.894Z'),
            //     'updated_at' : new Date('2015-07-22T09:42:13.894Z')
            // });

            // /* 16 */
            // Updates.insert({
            //     '_id' : '9g5dpuR5SWkvnDJLH',
            //     'upper_id' : null,
            //     'partup_id' : 'vGaxNojSerdizDPjb',
            //     'system' : true,
            //     'type' : 'partups_message_added',
            //     'type_data' : {
            //         'type' : 'welcome_message'
            //     },
            //     'comments_count' : 0,
            //     'created_at' : new Date('2015-07-22T09:42:13.895Z'),
            //     'updated_at' : new Date('2015-07-22T09:42:13.895Z')
            // });
    }
  }
});
