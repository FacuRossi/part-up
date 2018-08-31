import {
  defaultTags,
  defaultDescription,
} from './_defaults';

Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!Partups.find().count()) {

          // Public Tribe, Public Partup
          Partups.insert({
            // #base
            _id: 'gJngF65ZWyS9f3NDE',
            name: 'Public Partup in Public Tribe',
            slug: 'public-partup-in-public-tribe-gJngF65ZWyS9f3NDE',
            language: 'en',
            description: defaultDescription,
            privacy_type: Partups.privacy_types.NETWORK_PUBLIC,
            created_at: new Date('2015-07-21T15:52:04.548Z'),
            // #end base

            network_id: 'nqBnE8nSLasaapXXS',
            updated_at: new Date('2015-07-21T15:52:04.548Z'),

            // #extra
            image: 'FTHbg6wbPxjiA4Y8w',
            end_date: new Date('2017-01-31T00:00:00.000Z'),
            tags: defaultTags,
            location: {
              city: 'Utrecht',
              lat: 52.0907373999999876,
              lng: 5.1214200999999999,
              place_id: 'ChIJNy3TOUNvxkcR6UqvGUz8yNY',
              country: 'Netherlands'
            },
            // #end extra

            // #meta
            type: null,
            currency: null,
            type_commercial_budget: null,
            type_organization_budget: null,
            phase: null,
            progress: 0,
            // #end meta

            // #activities
            board_id: 'RJJy7iKHo3FinXsZQ',
            board_view: true,
            activity_count: 0,
            // #end activities

            // #users
            creator_id: 'q63Kii9wwJX3ADMIN',
            uppers: [
              'q63Kii9wwJX3ADMIN'
            ],
            supporters: [

            ],
            upper_data: [
              {
                _id: 'q63Kii9wwJX3ADMIN',
                new_updates: [],
              }
            ],
            // #end users
          });

          // Invite Tribe, Invite partup
          Partups.insert({
            // #base
            _id: 'qeGmorP5GQhXTsvTG',
            name: 'Invite Partup in Invite Tribe',
            slug: 'invite-partup-in-invite-tribe-qeGmorP5GQhXTsvTG',
            language: 'en',
            description: defaultDescription,
            privacy_type: Partups.privacy_types.NETWORK_INVITE,
            created_at: new Date('2015-07-21T15:52:04.548Z'),
            // #end base

            network_id: 'kRCjWDBkKru3KfsjW',
            updated_at: new Date('2015-07-21T15:52:04.548Z'),

            // #extra
            image: 'FTHbg6wbPxjiA4Y8w',
            end_date: new Date('2017-01-31T00:00:00.000Z'),
            tags: defaultTags,
            location: {
              city: 'Utrecht',
              lat: 52.0907373999999876,
              lng: 5.1214200999999999,
              place_id: 'ChIJNy3TOUNvxkcR6UqvGUz8yNY',
              country: 'Netherlands'
            },
            // #end extra

            // #meta
            type: null,
            currency: null,
            type_commercial_budget: null,
            type_organization_budget: null,
            phase: null,
            progress: 0,
            // #end meta

            // #activities
            board_id: '6hZCprmatAoeJpad7',
            board_view: true,
            activity_count: 0,
            // #end activities

            // #users
            creator_id: 'q63Kii9wwJX3ADMIN',
            uppers: [
              'q63Kii9wwJX3ADMIN',
            ],
            supporters: [

            ],
            upper_data: [
              {
                _id: 'q63Kii9wwJX3ADMIN',
                new_updates: [],
              }
            ],
            // #end users
          });

          // Closed Tribe, Closed partup
          Partups.insert({
            // #base
            _id: 'ApFBHLB9JXWZffFgm',
            name: 'Closed Partup in Closed Tribe',
            slug: 'closed-partup-in-closed-tribe-ApFBHLB9JXWZffFgm',
            language: 'en',
            description: defaultDescription,
            privacy_type: Partups.privacy_types.NETWORK_CLOSED,
            created_at: new Date('2015-07-21T15:52:04.548Z'),
            // #end base

            network_id: 'wfCv4ZdPe5WNT4xfg',
            updated_at: new Date('2015-07-21T15:52:04.548Z'),

            // #extra
            image: 'FTHbg6wbPxjiA4Y8w',
            end_date: new Date('2017-01-31T00:00:00.000Z'),
            tags: defaultTags,
            location: {
              city: 'Utrecht',
              lat: 52.0907373999999876,
              lng: 5.1214200999999999,
              place_id: 'ChIJNy3TOUNvxkcR6UqvGUz8yNY',
              country: 'Netherlands'
            },
            // #end extra

            // #meta
            type: null,
            currency: null,
            type_commercial_budget: null,
            type_organization_budget: null,
            phase: null,
            progress: 0,
            // #end meta

            // #activities
            board_id: 'ACSTwxnL64AtpMEqf',
            board_view: true,
            activity_count: 0,
            // #end activities

            // #users
            creator_id: 'q63Kii9wwJX3ADMIN',
            uppers: [
              'q63Kii9wwJX3ADMIN',
            ],
            supporters: [

            ],
            upper_data: [
              {
                _id: 'q63Kii9wwJX3ADMIN',
                new_updates: [],
              }
            ],
            // #end users
          });
        }
    }
});
