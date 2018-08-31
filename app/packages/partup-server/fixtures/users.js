import {
  defaultTags,
} from './_defaults';

Meteor.startup(function () {
  if (process.env.NODE_ENV.match(/development|staging/)) {
    if (!Meteor.users.find().count()) {

        const rn = () => Math.round(Math.random() * 100);

        // Admin user
        Meteor.users.insert({
          // #base
          _id: 'q63Kii9wwJX3ADMIN',
          createdAt: new Date(),
          profileVisibility: 'public',
          emails: [
            {
              address: 'admin@example.com',
              verified: true,
            }
          ],
          registered_emails: [
            {
              address: 'admin@example.com',
              verified: true,
            }
          ],
          // #end base

          // #meta
          participation_score: rn(),
          completeness: rn(),
          // #end meta

          // #authentication
          services: {
            password: {
              bcrypt: '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG', // user
            },
            resume: {
              loginTokens: [
                {
                  when: new Date(),
                  hashedToken: '1ctK9ULMl4Gdegbr+73LED8So83rPz67Xi6KnnNQCVQ=',
                }
              ]
            },
            email: {
              verificationTokens: [
                {
                  token: '1crlkpFefwhO_RdgJbnV-8q4S-_M0yfjFsn--YYh4YZ',
                  address: 'admin@example.com',
                  when: new Date(),
                }
              ]
            }
          },
          // #end authentication

          // #profile
          profile: {
            name: 'Admin User',
            normalized_name: 'admin user',
            description: 'I am the uber admin user',
            image: null,
            tags: defaultTags,
            location: {
              city: 'Amsterdam',
              lat: 52.3702157000000028,
              lng: 4.8951679000000006,
              place_id: 'ChIJVXealLU_xkcRja_At0z9AGY',
              country: 'Netherlands'
            },
            settings: {
              locale: 'en',
              optionalDetailsCompleted: true,
              email: {
                dailyDigest: true,
                upper_mentioned_in_partup: true,
                upper_mentioned_in_network_chat: true,
                invite_upper_to_partup_activity: true,
                invite_upper_to_network: true,
                partup_created_in_network: true,
                partups_networks_new_pending_upper: true,
                partups_networks_accepted: true,
                partups_new_comment_in_involved_conversation: true,
                partups_networks_new_upper: true,
                partups_networks_upper_left: true
              },
              unsubscribe_email_token: null,
            }
          },
          // #end profile

          // #status
          status: {
            online: false,
            idle: false,
            // lastLogin: {
            //   date: null,
            //   ipAddr: null,
            //   userAgent: null,
            // }
          },
          logins: [
            // new Date(),
          ],
          // #end status

          // #relations
          networks: [
            'nqBnE8nSLasaapXXS',
            'kRCjWDBkKru3KfsjW',
            'wfCv4ZdPe5WNT4xfg',
          ],
          pending_networks: [

          ],
          upperOf: [
            'gJngF65ZWyS9f3NDE',
            'qeGmorP5GQhXTsvTG',
            'ApFBHLB9JXWZffFgm',
          ],
          supporterOf: [

          ],
          chats: [

          ],
          // #end relations
        });

        // Default user
        Meteor.users.insert({
          // #base
          _id: 'K5c5M4PbdgDEFAULT',
          createdAt: new Date(),
          profileVisibility: 'public',
          emails: [
            {
              address: 'user@example.com',
              verified: true,
            }
          ],
          registered_emails: [
            {
              address: 'user@example.com',
              verified: true,
            }
          ],
          // #end base

          // #meta
          participation_score: rn(),
          completeness: rn(),
          // #end meta


          // #authentication
          services: {
            password: {
              bcrypt: '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG', // user
            },
            resume: {
              loginTokens: [
                {
                  when: new Date(),
                  hashedToken: '2ctK9ULMl4Gdegbr+73LED8So83rPz67Xi6KnnNQCVQ=',
                }
              ]
            },
            email: {
              verificationTokens: [
                {
                  token: '2crlkpFefwhO_RdgJbnV-8q4S-_M0yfjFsn--YYh4YZ',
                  address: null,
                  when: new Date(),
                }
              ]
            }
          },
          // #end authentication

          // #profile
          profile: {
            name: 'Default User',
            normalized_name: 'default user',
            description: 'I\'m just very default',
            image: null,
            tags: defaultTags,
            location: {
              city: 'Amsterdam',
              lat: 52.3702157000000028,
              lng: 4.8951679000000006,
              place_id: 'ChIJVXealLU_xkcRja_At0z9AGY',
              country: 'Netherlands'
            },
            settings: {
              locale: 'en',
              optionalDetailsCompleted: true,
              email: {
                dailyDigest: true,
                upper_mentioned_in_partup: true,
                upper_mentioned_in_network_chat: true,
                invite_upper_to_partup_activity: true,
                invite_upper_to_network: true,
                partup_created_in_network: true,
                partups_networks_new_pending_upper: true,
                partups_networks_accepted: true,
                partups_new_comment_in_involved_conversation: true,
                partups_networks_new_upper: true,
                partups_networks_upper_left: true
              },
              unsubscribe_email_token: null,
            }
          },
          // #end profile

          // #status
          status: {
            online: false,
            idle: false,
            // lastLogin: {
            //   date: null,
            //   ipAddr: null,
            //   userAgent: null,
            // }
          },
          logins: [
            // new Date(),
          ],
          // #end status

          // #relations
          networks: [
            'nqBnE8nSLasaapXXS',
          ],
          pending_networks: [

          ],
          upperOf: [

          ],
          supporterOf: [

          ],
          chats: [

          ],
          // #end relations
        });

        // John user
        Meteor.users.insert({
          // #base
          _id: 'K5c5M4Pbdg3B8JOHN',
          createdAt: new Date(),
          profileVisibility: 'public',
          emails: [
            {
              address: 'john@example.com',
              verified: false,
            }
          ],
          registered_emails: [
            {
              address: 'john@example.com',
              verified: false,
            }
          ],
          // #end base

          // #meta
          participation_score: rn(),
          completeness: rn(),
          // #end meta


          // #authentication
          services: {
            password: {
              bcrypt: '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG', // user
            },
            resume: {
              loginTokens: [
                {
                  when: new Date(),
                  hashedToken: '3ctK9ULMl4Gdegbr+73LED8So83rPz67Xi6KnnNQCVQ=',
                }
              ]
            },
            email: {
              verificationTokens: [
                {
                  token: '3crlkpFefwhO_RdgJbnV-8q4S-_M0yfjFsn--YYh4YZ',
                  address: 'john@example.com',
                  when: new Date(),
                }
              ]
            }
          },
          // #end authentication

          // #profile
          profile: {
            name: 'John User',
            normalized_name: 'john user',
            description: 'They call me John',
            image: null,
            tags: defaultTags,
            location: {
              city: 'Amsterdam',
              lat: 52.3702157000000028,
              lng: 4.8951679000000006,
              place_id: 'ChIJVXealLU_xkcRja_At0z9AGY',
              country: 'Netherlands'
            },
            settings: {
              locale: 'en',
              optionalDetailsCompleted: true,
              email: {
                dailyDigest: true,
                upper_mentioned_in_partup: true,
                upper_mentioned_in_network_chat: true,
                invite_upper_to_partup_activity: true,
                invite_upper_to_network: true,
                partup_created_in_network: true,
                partups_networks_new_pending_upper: true,
                partups_networks_accepted: true,
                partups_new_comment_in_involved_conversation: true,
                partups_networks_new_upper: true,
                partups_networks_upper_left: true
              },
              unsubscribe_email_token: null,
            }
          },
          // #end profile

          // #status
          status: {
            online: false,
            idle: false,
            // lastLogin: {
            //   date: null,
            //   ipAddr: null,
            //   userAgent: null,
            // }
          },
          logins: [
            // new Date(),
          ],
          // #end status

          // #relations
          networks: [
            'nqBnE8nSLasaapXXS',
          ],
          pending_networks: [

          ],
          upperOf: [

          ],
          supporterOf: [

          ],
          chats: [

          ],
          // #end relations
        });

        // Judy user
        Meteor.users.insert({
          // #base
          _id: 'K5c5M4Pbdg3B8JUDY',
          createdAt: new Date(),
          profileVisibility: 'public',
          emails: [
            {
              address: 'judy@example.com',
              verified: false,
            }
          ],
          registered_emails: [
            {
              address: 'judy@example.com',
              verified: false,
            }
          ],
          // #end base

          // #meta
          participation_score: rn(),
          completeness: rn(),
          // #end meta


          // #authentication
          services: {
            password: {
              bcrypt: '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG', // user
            },
            resume: {
              loginTokens: [
                {
                  when: new Date(),
                  hashedToken: '4ctK9ULMl4Gdegbr+73LED8So83rPz67Xi6KnnNQCVQ=',
                }
              ]
            },
            email: {
              verificationTokens: [
                {
                  token: '4crlkpFefwhO_RdgJbnV-8q4S-_M0yfjFsn--YYh4YZ',
                  address: 'judy@example.com',
                  when: new Date(),
                }
              ]
            }
          },
          // #end authentication

          // #profile
          profile: {
            name: 'Judy User',
            normalized_name: 'judy user',
            description: 'They call me Judy',
            image: null,
            tags: defaultTags,
            location: {
              city: 'Amsterdam',
              lat: 52.3702157000000028,
              lng: 4.8951679000000006,
              place_id: 'ChIJVXealLU_xkcRja_At0z9AGY',
              country: 'Netherlands'
            },
            settings: {
              locale: 'en',
              optionalDetailsCompleted: true,
              email: {
                dailyDigest: true,
                upper_mentioned_in_partup: true,
                upper_mentioned_in_network_chat: true,
                invite_upper_to_partup_activity: true,
                invite_upper_to_network: true,
                partup_created_in_network: true,
                partups_networks_new_pending_upper: true,
                partups_networks_accepted: true,
                partups_new_comment_in_involved_conversation: true,
                partups_networks_new_upper: true,
                partups_networks_upper_left: true
              },
              unsubscribe_email_token: null,
            }
          },
          // #end profile

          // #status
          status: {
            online: false,
            idle: false,
            // lastLogin: {
            //   date: null,
            //   ipAddr: null,
            //   userAgent: null,
            // }
          },
          logins: [
            // new Date(),
          ],
          // #end status

          // #relations
          networks: [
            'nqBnE8nSLasaapXXS',
          ],
          pending_networks: [

          ],
          upperOf: [

          ],
          supporterOf: [

          ],
          chats: [

          ],
          // #end relations
        });

        // Public user 1
        Meteor.users.insert({
          // #base
          _id: 'K5c5M4Pbdg3B8PUU1',
          createdAt: new Date(),
          profileVisibility: 'public',
          emails: [
            {
              address: 'public1@example.com',
              verified: false,
            }
          ],
          registered_emails: [
            {
              address: 'public1@example.com',
              verified: false,
            }
          ],
          // #end base

          // #meta
          participation_score: rn(),
          completeness: rn(),
          // #end meta


          // #authentication
          services: {
            password: {
              bcrypt: '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG', // user
            },
            resume: {
              loginTokens: [
                {
                  when: new Date(),
                  hashedToken: '5ctK9ULMl4Gdegbr+73LED8So83rPz67Xi6KnnNQCVQ=',
                }
              ]
            },
            email: {
              verificationTokens: [
                {
                  token: '5crlkpFefwhO_RdgJbnV-8q4S-_M0yfjFsn--YYh4YZ',
                  address: 'public1@example.com',
                  when: new Date(),
                }
              ]
            }
          },
          // #end authentication

          // #profile
          profile: {
            name: 'Public User 1',
            normalized_name: 'public user 1',
            description: 'My profile is public',
            image: null,
            tags: defaultTags,
            location: {
              city: 'Amsterdam',
              lat: 52.3702157000000028,
              lng: 4.8951679000000006,
              place_id: 'ChIJVXealLU_xkcRja_At0z9AGY',
              country: 'Netherlands'
            },
            settings: {
              locale: 'en',
              optionalDetailsCompleted: true,
              email: {
                dailyDigest: true,
                upper_mentioned_in_partup: true,
                upper_mentioned_in_network_chat: true,
                invite_upper_to_partup_activity: true,
                invite_upper_to_network: true,
                partup_created_in_network: true,
                partups_networks_new_pending_upper: true,
                partups_networks_accepted: true,
                partups_new_comment_in_involved_conversation: true,
                partups_networks_new_upper: true,
                partups_networks_upper_left: true
              },
              unsubscribe_email_token: null,
            }
          },
          // #end profile

          // #status
          status: {
            online: false,
            idle: false,
            // lastLogin: {
            //   date: null,
            //   ipAddr: null,
            //   userAgent: null,
            // }
          },
          logins: [
            // new Date(),
          ],
          // #end status

          // #relations
          networks: [

          ],
          pending_networks: [

          ],
          upperOf: [

          ],
          supporterOf: [

          ],
          chats: [

          ],
          // #end relations
        });

        // Public user 2
        Meteor.users.insert({
          // #base
          _id: 'K5c5M4Pbdg3B8PUU2',
          createdAt: new Date(),
          profileVisibility: 'public',
          emails: [
            {
              address: 'public2@example.com',
              verified: false,
            }
          ],
          registered_emails: [
            {
              address: 'public2@example.com',
              verified: false,
            }
          ],
          // #end base

          // #meta
          participation_score: rn(),
          completeness: rn(),
          // #end meta


          // #authentication
          services: {
            password: {
              bcrypt: '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG', // user
            },
            resume: {
              loginTokens: [
                {
                  when: new Date(),
                  hashedToken: '6ctK9ULMl4Gdegbr+73LED8So83rPz67Xi6KnnNQCVQ=',
                }
              ]
            },
            email: {
              verificationTokens: [
                {
                  token: '6crlkpFefwhO_RdgJbnV-8q4S-_M0yfjFsn--YYh4YZ',
                  address: 'public2@example.com',
                  when: new Date(),
                }
              ]
            }
          },
          // #end authentication

          // #profile
          profile: {
            name: 'Public User 2',
            normalized_name: 'public user 2',
            description: 'My profile is public',
            image: null,
            tags: defaultTags,
            location: {
              city: 'Amsterdam',
              lat: 52.3702157000000028,
              lng: 4.8951679000000006,
              place_id: 'ChIJVXealLU_xkcRja_At0z9AGY',
              country: 'Netherlands'
            },
            settings: {
              locale: 'en',
              optionalDetailsCompleted: true,
              email: {
                dailyDigest: true,
                upper_mentioned_in_partup: true,
                upper_mentioned_in_network_chat: true,
                invite_upper_to_partup_activity: true,
                invite_upper_to_network: true,
                partup_created_in_network: true,
                partups_networks_new_pending_upper: true,
                partups_networks_accepted: true,
                partups_new_comment_in_involved_conversation: true,
                partups_networks_new_upper: true,
                partups_networks_upper_left: true
              },
              unsubscribe_email_token: null,
            }
          },
          // #end profile

          // #status
          status: {
            online: false,
            idle: false,
            // lastLogin: {
            //   date: null,
            //   ipAddr: null,
            //   userAgent: null,
            // }
          },
          logins: [
            // new Date(),
          ],
          // #end status

          // #relations
          networks: [

          ],
          pending_networks: [

          ],
          upperOf: [

          ],
          supporterOf: [

          ],
          chats: [

          ],
          // #end relations
        });

        // Partup user 1
        Meteor.users.insert({
          // #base
          _id: 'K5c5M4Pbdg3B8PAU1',
          createdAt: new Date(),
          profileVisibility: 'partup',
          emails: [
            {
              address: 'partup1@example.com',
              verified: false,
            }
          ],
          registered_emails: [
            {
              address: 'partup1@example.com',
              verified: false,
            }
          ],
          // #end base

          // #meta
          participation_score: rn(),
          completeness: rn(),
          // #end meta


          // #authentication
          services: {
            password: {
              bcrypt: '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG', // user
            },
            resume: {
              loginTokens: [
                {
                  when: new Date(),
                  hashedToken: '7ctK9ULMl4Gdegbr+73LED8So83rPz67Xi6KnnNQCVQ=',
                }
              ]
            },
            email: {
              verificationTokens: [
                {
                  token: '7crlkpFefwhO_RdgJbnV-8q4S-_M0yfjFsn--YYh4YZ',
                  address: 'partup1@example.com',
                  when: new Date(),
                }
              ]
            }
          },
          // #end authentication

          // #profile
          profile: {
            name: 'Partup User 1',
            normalized_name: 'partup user 1',
            description: 'My profile is only visible for users with an account on partup',
            image: null,
            tags: defaultTags,
            location: {
              city: 'Amsterdam',
              lat: 52.3702157000000028,
              lng: 4.8951679000000006,
              place_id: 'ChIJVXealLU_xkcRja_At0z9AGY',
              country: 'Netherlands'
            },
            settings: {
              locale: 'en',
              optionalDetailsCompleted: true,
              email: {
                dailyDigest: true,
                upper_mentioned_in_partup: true,
                upper_mentioned_in_network_chat: true,
                invite_upper_to_partup_activity: true,
                invite_upper_to_network: true,
                partup_created_in_network: true,
                partups_networks_new_pending_upper: true,
                partups_networks_accepted: true,
                partups_new_comment_in_involved_conversation: true,
                partups_networks_new_upper: true,
                partups_networks_upper_left: true
              },
              unsubscribe_email_token: null,
            }
          },
          // #end profile

          // #status
          status: {
            online: false,
            idle: false,
            // lastLogin: {
            //   date: null,
            //   ipAddr: null,
            //   userAgent: null,
            // }
          },
          logins: [
            // new Date(),
          ],
          // #end status

          // #relations
          networks: [

          ],
          pending_networks: [

          ],
          upperOf: [

          ],
          supporterOf: [

          ],
          chats: [

          ],
          // #end relations
        });

        // Partup user 2
        Meteor.users.insert({
          // #base
          _id: 'K5c5M4Pbdg3B8PAU2',
          createdAt: new Date(),
          profileVisibility: 'partup',
          emails: [
            {
              address: 'partup2@example.com',
              verified: false,
            }
          ],
          registered_emails: [
            {
              address: 'partup2@example.com',
              verified: false,
            }
          ],
          // #end base

          // #meta
          participation_score: rn(),
          completeness: rn(),
          // #end meta

          // #authentication
          services: {
            password: {
              bcrypt: '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG', // user
            },
            resume: {
              loginTokens: [
                {
                  when: new Date(),
                  hashedToken: '8ctK9LMl4Gdegbr+73LED8So83rPz67Xi6KnnNQCVQ=',
                }
              ]
            },
            email: {
              verificationTokens: [
                {
                  token: '8crlkpFefwhO_RdgJbnV-8q4S-_M0yfjFsn--YYh4YZ',
                  address: 'partup2@example.com',
                  when: new Date(),
                }
              ]
            }
          },
          // #end authentication

          // #profile
          profile: {
            name: 'Partup User 2',
            normalized_name: 'partup user 2',
            description: 'My profile is only visible for users with an account on partup',
            image: null,
            tags: defaultTags,
            location: {
              city: 'Amsterdam',
              lat: 52.3702157000000028,
              lng: 4.8951679000000006,
              place_id: 'ChIJVXealLU_xkcRja_At0z9AGY',
              country: 'Netherlands'
            },
            settings: {
              locale: 'en',
              optionalDetailsCompleted: true,
              email: {
                dailyDigest: true,
                upper_mentioned_in_partup: true,
                upper_mentioned_in_network_chat: true,
                invite_upper_to_partup_activity: true,
                invite_upper_to_network: true,
                partup_created_in_network: true,
                partups_networks_new_pending_upper: true,
                partups_networks_accepted: true,
                partups_new_comment_in_involved_conversation: true,
                partups_networks_new_upper: true,
                partups_networks_upper_left: true
              },
              unsubscribe_email_token: null,
            }
          },
          // #end profile

          // #status
          status: {
            online: false,
            idle: false,
            // lastLogin: {
            //   date: null,
            //   ipAddr: null,
            //   userAgent: null,
            // }
          },
          logins: [
            // new Date(),
          ],
          // #end status

          // #relations
          networks: [

          ],
          pending_networks: [

          ],
          upperOf: [

          ],
          supporterOf: [

          ],
          chats: [

          ],
          // #end relations
        });

        // Private user 1
        Meteor.users.insert({
          // #base
          _id: 'K5c5M4Pbdg3B8PRU1',
          createdAt: new Date(),
          profileVisibility: 'private',
          emails: [
            {
              address: 'private1@example.com',
              verified: false,
            }
          ],
          registered_emails: [
            {
              address: 'private1@example.com',
              verified: false,
            }
          ],
          // #end base

          // #meta
          participation_score: rn(),
          completeness: rn(),
          // #end meta


          // #authentication
          services: {
            password: {
              bcrypt: '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG', // user
            },
            resume: {
              loginTokens: [
                {
                  when: new Date(),
                  hashedToken: '9ctK9ULMl4Gdegbr+73LED8So83rPz67Xi6KnnNQCVQ=',
                }
              ]
            },
            email: {
              verificationTokens: [
                {
                  token: '9crlkpFefwhO_RdgJbnV-8q4S-_M0yfjFsn--YYh4YZ',
                  address: 'private1@example.com',
                  when: new Date(),
                }
              ]
            }
          },
          // #end authentication

          // #profile
          profile: {
            name: 'Private User 1',
            normalized_name: 'private user 1',
            description: 'My profile is only visible for users I am related to',
            image: null,
            tags: defaultTags,
            location: {
              city: 'Amsterdam',
              lat: 52.3702157000000028,
              lng: 4.8951679000000006,
              place_id: 'ChIJVXealLU_xkcRja_At0z9AGY',
              country: 'Netherlands'
            },
            settings: {
              locale: 'en',
              optionalDetailsCompleted: true,
              email: {
                dailyDigest: true,
                upper_mentioned_in_partup: true,
                upper_mentioned_in_network_chat: true,
                invite_upper_to_partup_activity: true,
                invite_upper_to_network: true,
                partup_created_in_network: true,
                partups_networks_new_pending_upper: true,
                partups_networks_accepted: true,
                partups_new_comment_in_involved_conversation: true,
                partups_networks_new_upper: true,
                partups_networks_upper_left: true
              },
              unsubscribe_email_token: null,
            }
          },
          // #end profile

          // #status
          status: {
            online: false,
            idle: false,
            // lastLogin: {
            //   date: null,
            //   ipAddr: null,
            //   userAgent: null,
            // }
          },
          logins: [
            // new Date(),
          ],
          // #end status

          // #relations
          networks: [

          ],
          pending_networks: [

          ],
          upperOf: [

          ],
          supporterOf: [

          ],
          chats: [

          ],
          // #end relations
        });

        // Private user 2
        Meteor.users.insert({
          // #base
          _id: 'K5c54Pbdg3B8PRU2',
          createdAt: new Date(),
          profileVisibility: 'private',
          emails: [
            {
              address: 'private2@example.com',
              verified: false,
            }
          ],
          registered_emails: [
            {
              address: 'private2@example.com',
              verified: false,
            }
          ],
          // #end base

          // #meta
          participation_score: rn(),
          completeness: rn(),
          // #end meta


          // #authentication
          services: {
            password: {
              bcrypt: '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG', // user
            },
            resume: {
              loginTokens: [
                {
                  when: new Date(),
                  hashedToken: '10tK9ULMl4Gdegbr+73LED8So83rPz67Xi6KnnNQCVQ=',
                }
              ]
            },
            email: {
              verificationTokens: [
                {
                  token: '10rlkpFefwhO_RdgJbnV-8q4S-_M0yfjFsn--YYh4YZ',
                  address: 'private2@example.com',
                  when: new Date(),
                }
              ]
            }
          },
          // #end authentication

          // #profile
          profile: {
            name: 'Private User 2',
            normalized_name: 'private user 2',
            description: 'My profile is only visible for users I am related to',
            image: null,
            tags: defaultTags,
            location: {
              city: 'Amsterdam',
              lat: 52.3702157000000028,
              lng: 4.8951679000000006,
              place_id: 'ChIJVXealLU_xkcRja_At0z9AGY',
              country: 'Netherlands'
            },
            settings: {
              locale: 'en',
              optionalDetailsCompleted: true,
              email: {
                dailyDigest: true,
                upper_mentioned_in_partup: true,
                upper_mentioned_in_network_chat: true,
                invite_upper_to_partup_activity: true,
                invite_upper_to_network: true,
                partup_created_in_network: true,
                partups_networks_new_pending_upper: true,
                partups_networks_accepted: true,
                partups_new_comment_in_involved_conversation: true,
                partups_networks_new_upper: true,
                partups_networks_upper_left: true
              },
              unsubscribe_email_token: null,
            }
          },
          // #end profile

          // #status
          status: {
            online: false,
            idle: false,
            // lastLogin: {
            //   date: null,
            //   ipAddr: null,
            //   userAgent: null,
            // }
          },
          logins: [
            // new Date(),
          ],
          // #end status

          // #relations
          networks: [

          ],
          pending_networks: [

          ],
          upperOf: [

          ],
          supporterOf: [

          ],
          chats: [

          ],
          // #end relations
        });
    }
  }
});
