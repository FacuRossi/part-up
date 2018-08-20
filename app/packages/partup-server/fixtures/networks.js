import {
  defaultDescription,
} from './_defaults';

Meteor.startup(function() {
    if (process.env.NODE_ENV.match(/development|staging/)) {
        if (!Networks.find().count()) {

          /*
           * PUBLIC TRIBE
           **/
          Networks.insert({

            // #base
            _id: 'nqBnE8nSLasaapXXS',
            name: 'Public Tribe',
            slug: 'public-tribe',
            language: 'en',
            description: defaultDescription,
            privacy_type: Networks.privacy_types.NETWORK_PUBLIC,
            created_at: new Date('2015-07-21T15:47:33.225Z'),
            updated_at: new Date('2015-07-21T15:47:33.225Z'),
            stats: {},
            // #end base

            // #relations
            icon: 'T8pfWebTJmvbBNJ2g',
            image: 'f7yzkqh9J9JvxCCqN',
            chat_id: 'fMpNncPh4Qua6NANH',
            sector_id: '9oNQGxTCKqvsTADnl', // Cultuur
            // #end relations

            // #users
            admins: [
              'q63Kii9wwJX3ADMIN',
            ],
            uppers: [
              'q63Kii9wwJX3ADMIN',
              'K5c5M4PbdgDEFAULT',
              'K5c5M4Pbdg3B8JOHN',
              'K5c5M4Pbdg3B8JUDY',
            ],
            most_active_uppers: [
              'q63Kii9wwJX3ADMIN',
              'K5c5M4PbdgDEFAULT',
              'K5c5M4Pbdg3B8JOHN',
              'K5c5M4Pbdg3B8JUDY',
            ],
          });

          /*
           * INVITE TRIBE
           **/
          Networks.insert({

            // #base
            _id: 'kRCjWDBkKru3KfsjW',
            name: 'Invite Tribe',
            slug: 'invite-tribe',
            language: 'en',
            description : defaultDescription,
            privacy_type: Networks.privacy_types.NETWORK_INVITE,
            created_at: new Date('2015-07-21T15:51:48.825Z'),
            updated_at: new Date('2015-07-21T15:51:48.825Z'),
            stats: {},
            // #end base

            // #relations
            icon: 'efDuvuTzpqH65P9DF',
            image: 'fReGXG4qkNXb4K8wp',
            chat_id: 'JSGpNRF5R3gjEWcGf',
            sector_id: '9oNQGxTCKqvsTADnl', // Cultuur
            // #end relations

            // #users
            admins: [
              'q63Kii9wwJX3ADMIN',
            ],
            uppers: [
              'q63Kii9wwJX3ADMIN',
            ],
            most_active_uppers: [
              'q63Kii9wwJX3ADMIN',
            ],
            // #end users
          });

          /*
           * CLOSED TRIBE
           **/
          Networks.insert({
            // #base
            _id: 'wfCv4ZdPe5WNT4xfg',
            name: 'Closed Tribe',
            slug: 'closed-tribe',
            language: 'en',
            description: defaultDescription,
            privacy_type: Networks.privacy_types.NETWORK_CLOSED,
            created_at: new Date('2015-07-21T15:51:56.562Z'),
            updated_at: new Date('2015-07-21T15:51:56.562Z'),
            stats: {},
            // #end base

            // #relations
            icon: 'PnYAg3EX5dKfEnkdn',
            image: '4rymNTA3jFfTRKtFJ',
            chat_id: '9nTogbMy6Ddjfh6NP',
            sector_id: '9oNQGxTCKqvsTADnl', // Cultuur
            // #end relations

            // #users
            admins: [
              'q63Kii9wwJX3ADMIN',
            ],
            uppers: [
              'q63Kii9wwJX3ADMIN',
            ],
            most_active_uppers: [
              'q63Kii9wwJX3ADMIN',
            ],
            // #endusers

            // #invites

            // invites: [
            //   {
            //     _id: '',
            //     invited_at: new Date(),
            //     invited_by_id: '',
            //   }
            // ],

            // pending_uppers: [
            //   '',
            // ],

            // #end invites
          });
        }
    }
});
