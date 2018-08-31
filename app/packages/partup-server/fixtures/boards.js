import { range } from 'lodash';

Meteor.startup(function () {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!Boards.find().count()) {
          /*
            * Public Tribe,
            * Public Partup
          **/
          Boards.insert({
            _id: 'RJJy7iKHo3FinXsZQ',
            partup_id: 'gJngF65ZWyS9f3NDE',
            created_at: new Date(),
            updated_at: new Date(),
            lanes: [
              'M8yEL4e3zY7Ar4ze0',
            ]
          });
          /*
            * Invite Tribe,
            * Invite Partup
          **/
          Boards.insert({
            _id: '6hZCprmatAoeJpad7',
            partup_id: 'qeGmorP5GQhXTsvTG',
            created_at: new Date(),
            updated_at: new Date(),
            lanes: [
              'M8yEL4e3zY7Ar4zaq',
            ]
          });

          /*
            * Closed Tribe,
            * Closed Partup
          **/
          Boards.insert({
            _id: 'ACSTwxnL64AtpMEqf',
            partup_id: 'ApFBHLB9JXWZffFgm',
            created_at: new Date(),
            updated_at: new Date(),
            lanes: [
              'M8yEL4e3zY7Ar4zwq',
            ]
          });

        }
    }
});
