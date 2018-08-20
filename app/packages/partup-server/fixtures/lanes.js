Meteor.startup(function () {
  if (process.env.NODE_ENV.match(/development|staging/)) {
    if (!Lanes.find().count()) {

      /*
       *  Public Tribe, Public Partup
       **/
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4ze0',
        board_id: 'RJJy7iKHo3FinXsZQ',
        name: 'Backlog',
        created_at: new Date(),
        updated_at: new Date(),
        activities: [

        ],
      });

      /*
       *  Invite Tribe, Invite Partup
       **/
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4zaq',
        board_id: '6hZCprmatAoeJpad7',
        name: 'Backlog',
        created_at: new Date(),
        updated_at: new Date(),
        activities: [

        ],
      });

      /*
       *  Closed Tribe, Closed Partup
       **/
      Lanes.insert({
        _id: 'M8yEL4e3zY7Ar4zwq',
        board_id: 'ACSTwxnL64AtpMEqf',
        name: 'Backlog',
        created_at: new Date(),
        updated_at: new Date(),
        activities: [

        ],
      });

    }
  }
});
