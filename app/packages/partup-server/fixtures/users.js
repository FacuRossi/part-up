Meteor.startup(function () {
    if (process.env.NODE_ENV.match(/development|staging/)) {

        if (!Meteor.users.find().count()) {
            Meteor.users.insert({
                '_id': 'K5c5M4Pbdg3B82wQH',
                'createdAt': new Date(),
                'services': {
                    'password': {
                        'bcrypt': '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG'
                    },
                    'resume': {
                        'loginTokens': [
                            {
                                'when': new Date(),
                                'hashedToken': 'yoxRsvKflDfC/tKh2en1Pka+rVymsYIQ3QOlq0EVSB4='
                            }
                        ]
                    },
                    'email': {
                        'verificationTokens': [
                            {
                                'token': 'CTel11muhC80_UYGDcVz8J5kTU4zkli_UEo73oH427d',
                                'address': 'user@example.com',
                                'when': new Date()
                            }
                        ]
                    }
                },
                'emails': [
                    {
                        'address': 'user@example.com',
                        'verified': false
                    }
                ],
                'completeness': 100,
                'profile': {
                    'name': 'Default User',
                    'normalized_name': 'default user',
                    'settings': {
                        'locale': 'en',
                        'optionalDetailsCompleted': true,
                        'email': {
                            'dailydigest': true,
                            'upper_mentioned_in_partup': true,
                            'upper_mentioned_in_network_chat': true,
                            'invite_upper_to_partup_activity': true,
                            'invite_upper_to_network': true,
                            'partup_created_in_network': true,
                            'partups_networks_new_pending_upper': true,
                            'partups_networks_accepted': true,
                            'partups_new_comment_in_involved_conversation': true,
                            'partups_networks_new_upper': true,
                            'partups_networks_upper_left': true
                        },
                        'unsubscribe_email_token': 'nj8fwDnhzaPSKX4vf-8ZHFyWRL0ZKVRz00ZOrJdB-ug'
                    },
                    'image': 'oQeqgwkdd44JSBSW5',
                    'description': 'I am the first test user',
                    'tags': [
                        'education',
                        'school',
                        'teaching'
                    ],
                    'location': {
                        'city': 'Amsterdam',
                        'lat': 52.3702157000000028,
                        'lng': 4.8951679000000006,
                        'place_id': 'ChIJVXealLU_xkcRja_At0z9AGY',
                        'country': 'Netherlands'
                    },
                    'facebook_url': 'https://www.facebook.com/zuck',
                    'twitter_url': 'https://twitter.com/finkd',
                    'instagram_url': 'https://instagram.com/zuck/',
                    'linkedin_url': 'https://www.linkedin.com/pub/mark-zuckerberg/0/290/362',
                    'phonenumber': '+31612345678',
                    'website': 'http://www.facebook.com',
                    'skype': 'markzuckerberg',
                },
                'status': {
                    'online': true,
                    'lastLogin': {
                        'date': new Date('2015-07-21T13:29:39.740Z'),
                        'ipAddr': '127.0.0.1',
                        'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
                    },
                    'idle': false
                },
                'registered_emails': [
                    {
                        'address': 'user@example.com',
                        'verified': false
                    }
                ],
                'logins': [
                    new Date('2015-07-21T13:29:39.754Z')
                ],
                'networks': [
                    'ibn27M3ePaXhmKzWq',
                    'kRCjWDBkKru3KfsjW',
					'bmAGcqxmb6izfgXLK'
                ],
                'participation_score': 2,
                'upperOf': [
                    'ASfRYBAzo2ayYk5si',
                    'vGaxNojSerdizDPjb',
                    'vGaxNojSerdizDPjc',
                    'vGaxNojSerdizDPjd',
                    'gJngF65ZWyS9f3NDE'
                ],
                'flags': {
                    'dailyDigestEmailHasBeenSent': false
                },
                'chats': [
                    '9yscDD9bTkT2eDF4c'
                ]
            });

            Meteor.users.insert({
                '_id': 'K5c5M4Pbdg3B82wQI',
                'createdAt': new Date('2015-07-21T13:43:28.401Z'),
                'services': {
                    'password': {
                        'bcrypt': '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG'
                    },
                    'resume': {
                        'loginTokens': [
                            {
                                'when': new Date('2015-07-21T13:43:28.427Z'),
                                'hashedToken': 'OpaU/qV1S7zHl00V9Nkvc9cd6HVBgldaSOjxTbZKLUk='
                            }
                        ]
                    },
                    'email': {
                        'verificationTokens': [
                            {
                                'token': 'iLvpqSreco1pP4vBXXpxf3_tASF-KeDKMcDv1STKLhD',
                                'address': 'john@example.com',
                                'when': new Date('2015-07-21T13:43:33.407Z')
                            }
                        ]
                    }
                },
                'emails': [
                    {
                        'address': 'john@example.com',
                        'verified': false
                    }
                ],
                'completeness': 27,
                'profile': {
                    'name': 'John Partup',
                    'normalized_name': 'john partup',
                    'settings': {
                        'locale': 'en',
                        'optionalDetailsCompleted': true,
                        'email': {
                            'dailydigest': true,
                            'upper_mentioned_in_partup': true,
                            'upper_mentioned_in_network_chat': true,
                            'invite_upper_to_partup_activity': true,
                            'invite_upper_to_network': true,
                            'partup_created_in_network': true,
                            'partups_networks_new_pending_upper': true,
                            'partups_networks_accepted': true,
                            'partups_new_comment_in_involved_conversation': true,
                            'partups_networks_new_upper': true,
                            'partups_networks_upper_left': true
                        },
                        'unsubscribe_email_token': '6BQGhT9KnxBKAIrn6Y7s565CTOO-SIqfjuHOkJt8ZbQ'
                    },
                    'image': 'cHhjpWKo9DHjXQQjy',
                    'description': null,
                    'tags': [
                        'education',
                        'nonprofit',
                        'development'
                    ],
                    'location': {
                        'city': 'Amstelveen',
                        'lat': 52.3114206999999993,
                        'lng': 4.8700869999999998,
                        'place_id': 'ChIJL2JPy9DhxUcRqXfKsBMyNVw',
                        'country': 'Netherlands'
                    },
                    'facebook_url': null,
                    'twitter_url': null,
                    'instagram_url': null,
                    'linkedin_url': null,
                    'phonenumber': null,
                    'website': '',
                    'skype': null,
                    'meurs': {
                        'portal': 'nl',
                        'nl_id': 'caba5cd4-f769-4093-878c-4ce3807781c3',
                        'program_session_id': 31373
                    }
                },
                'status': {
                    'online': true,
                    'lastLogin': {
                        'date': new Date('2015-07-21T13:43:28.514Z'),
                        'ipAddr': '127.0.0.1',
                        'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
                    },
                    'idle': false
                },
                'registered_emails': [
                    {
                        'address': 'john@example.com',
                        'verified': false
                    }
                ],
                'logins': [
                    new Date('2015-07-21T13:43:28.542Z')
                ],
                'participation_score': 3,
                'pending_networks': [],
                'networks': [
                    'wfCv4ZdPe5WNT4xfg'
                ],
                'supporterOf' : [
                    'vGaxNojSerdizDPjb'
                ],
                'upperOf': [
                    'CJETReuE6uo2eF7eW',
                    'gJngF65ZWyS9f3NDE',
                    'vGaxNojSerdizDPjc'
                ],
                'flags': {
                    'dailyDigestEmailHasBeenSent': false
                },
                'chats': [
                    '9yscDD9bTkT2eDF4c'
                ]
            });

            Meteor.users.insert({
                '_id': 'q63Kii9wwJX3Q6rHS',
                'createdAt': new Date('2015-07-21T13:48:03.558Z'),
                'services': {
                    'password': {
                        'bcrypt': '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG'
                    },
                    'resume': {
                        'loginTokens': [
                            {
                                'when': new Date('2015-07-21T13:48:03.566Z'),
                                'hashedToken': 'vctK9ULMl4Gdegbr+73LED8So83rPz67Xi6KnnNQCVQ='
                            }
                        ]
                    },
                    'email': {
                        'verificationTokens': [
                            {
                                'token': '8crlkpFefwhO_RdgJbnV-8q4S-_M0yfjFsn--YYh4YZ',
                                'address': 'admin@example.com',
                                'when': new Date('2015-07-21T13:48:08.563Z')
                            }
                        ]
                    }
                },
                'emails': [
                    {
                        'address': 'admin@example.com',
                        'verified': false
                    }
                ],
                'completeness': 27,
                'profile': {
                    'name': 'Admin User',
                    'normalized_name': 'admin user',
                    'settings': {
                        'locale': 'en',
                        'optionalDetailsCompleted': true,
                        'email': {
                            'dailydigest': true,
                            'upper_mentioned_in_partup': true,
                            'upper_mentioned_in_network_chat': true,
                            'invite_upper_to_partup_activity': true,
                            'invite_upper_to_network': true,
                            'partup_created_in_network': true,
                            'partups_networks_new_pending_upper': true,
                            'partups_networks_accepted': true,
                            'partups_new_comment_in_involved_conversation': true,
                            'partups_networks_new_upper': true,
                            'partups_networks_upper_left': true
                        },
                        'unsubscribe_email_token': 'Xr_FQVj16IQRwpoMxQOWgHMVr5z6Jd04wpvF00n6rK6'
                    },
                    'image': 'CxEprGKNWo6HdrTdq',
                    'description': null,
                    'tags': [
                        'administration',
                        'finance'
                    ],
                    'location': {
                        'city': 'Utrecht',
                        'lat': 52.0907373999999876,
                        'lng': 5.1214200999999999,
                        'place_id': 'ChIJNy3TOUNvxkcR6UqvGUz8yNY',
                        'country': 'Netherlands'
                    },
                    'facebook_url': null,
                    'twitter_url': null,
                    'instagram_url': null,
                    'linkedin_url': null,
                    'phonenumber': null,
                    'website': '',
                    'skype': null,
                    'meurs': {
                        'portal': 'en',
                        'nl_id': '44e74f98-fd0f-4c9a-82e1-82e1528409f5',
                        'en_id': 'b7b44c5b-36f9-4c88-a2a7-3b3aa8709255',
                        'program_session_id': 32724,
                        'fetched_results': true,
                        'results': [
                            {
                                'code': 103405,
                                'name': 'Persoonlijke kracht',
                                'score': 8,
                                'zscore': 0.8000400000000001,
                                'dscore': 7,
                                'highIndex': 1
                            },
                            {
                                'code': 103402,
                                'name': 'Stuurkracht',
                                'score': 7,
                                'zscore': 0.7000500000000001,
                                'dscore': 6,
                                'highIndex': 1
                            }
                        ]
                    }
                },
                'status': {
                    'online': true,
                    'lastLogin': {
                        'date': new Date('2015-07-21T13:48:03.623Z'),
                        'ipAddr': '127.0.0.1',
                        'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
                    },
                    'idle': false
                },
                'registered_emails': [
                    {
                        'address': 'admin@example.com',
                        'verified': false
                    }
                ],
                'logins': [
                    new Date('2015-07-21T13:48:03.641Z')
                ],
                'roles': ['admin'],
                'networks': [
                    'nqBnE8nSLasaapXXS',
                    'kRCjWDBkKru3KfsjW',
                    'wfCv4ZdPe5WNT4xfg',
                    'ibn27M3ePaXhmKzWq',
					'bmAGcqxmb6izfgXLK'
                ],
                'upperOf' : [
                    'gJngF65ZWyS9f3NDE',
                    'ASfRYBAzo2ayYk5si',
                    'vGaxNojSerdizDPjc',
                    'vGaxNojSerdizDPjd'
                ],
                'participation_score': 2,
                'flags': {
                    'dailyDigestEmailHasBeenSent': false
                }
            });

            Meteor.users.insert({
                '_id': 'a7qcp5RHnh5rfaeW9',
                'createdAt': new Date('2015-07-21T14:11:01.053Z'),
                'services': {
                    'password': {
                        'bcrypt': '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG'
                    },
                    'resume': {
                        'loginTokens': [
                            {
                                'when': new Date('2015-07-21T14:11:01.061Z'),
                                'hashedToken': 'QR5jRUOgOYNkrUZNjPdYicokC8hggzWimey9ccMMSG8='
                            }
                        ]
                    },
                    'email': {
                        'verificationTokens': [
                            {
                                'token': 'X0BHuAeVNCWozOenCCTdXltEXE1kPB0VZBriz39Src4',
                                'address': 'judy@example.com',
                                'when': new Date('2015-07-21T14:11:06.055Z')
                            }
                        ]
                    }
                },
                'emails': [
                    {
                        'address': 'judy@example.com',
                        'verified': false
                    }
                ],
                'completeness': 27,
                'profile': {
                    'name': 'Judy Partup',
                    'normalized_name': 'judy partup',
                    'settings': {
                        'locale': 'en',
                        'optionalDetailsCompleted': true,
                        'email': {
                            'dailydigest': true,
                            'upper_mentioned_in_partup': true,
                            'upper_mentioned_in_network_chat': true,
                            'invite_upper_to_partup_activity': true,
                            'invite_upper_to_network': true,
                            'partup_created_in_network': true,
                            'partups_networks_new_pending_upper': true,
                            'partups_networks_accepted': true,
                            'partups_new_comment_in_involved_conversation': true,
                            'partups_networks_new_upper': true,
                            'partups_networks_upper_left': true
                        },
                        'unsubscribe_email_token': 'WiYdZ-AoYintHgYofjIlOyWTsP8f2oNKLhh3jhhpIdN'
                    },
                    'image': 'bMTGT9oSDGzxCL3r4',
                    'description': null,
                    'tags': [
                        'design',
                        'ux',
                        'photography',
                        'nonprofit'
                    ],
                    'location': {
                        'city': 'Maastricht',
                        'lat': 50.8513682000000031,
                        'lng': 5.6909725000000000,
                        'place_id': 'ChIJnwZBWOzpwEcRbqi-zHuV61M',
                        'country': 'Netherlands'
                    },
                    'facebook_url': null,
                    'twitter_url': null,
                    'instagram_url': null,
                    'linkedin_url': null,
                    'phonenumber': null,
                    'website': '',
                    'skype': null,
                    'meurs': {
                        'portal': 'en',
                        'nl_id': 'f8cb5c45-bdb5-4a98-9f98-a7d5fdcd7115',
                        'en_id': '503a6931-4a68-4595-83fa-4e77098727cc',
                        'program_session_id': 32698,
                        'fetched_results': true,
                        'results': [
                            {
                                'code': 103401,
                                'name': 'Denkkracht',
                                'score': 9,
                                'zscore': 0.90003,
                                'dscore': 8,
                                'highIndex': 1
                            },
                            {
                                'code': 103405,
                                'name': 'Persoonlijke kracht',
                                'score': 7,
                                'zscore': 0.7000400000000001,
                                'dscore': 6,
                                'highIndex': 1
                            }
                        ]
                    }
                },
                'status': {
                    'online': true,
                    'lastLogin': {
                        'date': new Date('2015-07-21T14:11:01.089Z'),
                        'ipAddr': '127.0.0.1',
                        'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
                    },
                    'idle': false
                },
                'registered_emails': [
                    {
                        'address': 'judy@example.com',
                        'verified': false
                    }
                ],
                'logins': [
                    new Date('2015-07-21T14:11:01.103Z')
                ],
                'participation_score': 3,
                'pending_networks': [
                    'wfCv4ZdPe5WNT4xfg'
                ],
                'networks': [
                    'ibn27M3ePaXhmKzWq'
                ],
                'upperOf': [
                    'vGaxNojSerdizDPjb',
                    'vGaxNojSerdizDPjd'
                ],
                'supporterOf': [
                    'gJngF65ZWyS9f3NDE'
                ],
                'flags': {
                    'dailyDigestEmailHasBeenSent': false
                }
            });

            Meteor.users.insert({
                '_id': 'efh2F9LHJwNPqvzKs',
                'createdAt': new Date('2017-05-21T14:11:01.053Z'),
                'services': {
                    'password': {
                        'bcrypt': '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG'
                    },
                    'resume': {
                        'loginTokens': [
                            {
                                'when': new Date('2015-07-21T14:11:01.061Z'),
                                'hashedToken': 'QR5jRUOgOYNkrUZNjPdYicokC8hggzWimey9ccMMSG9='
                            }
                        ]
                    },
                    'email': {
                        'verificationTokens': [
                            {
                                'token': 'X0BHuAeVNCWozOenCCTdXltEXE1kPB0VZBriz39Src5',
                                'address': 'threewords@example.com',
                                'when': new Date('2015-07-21T14:11:06.055Z')
                            }
                        ]
                    }
                },
                'emails': [
                    {
                        'address': 'threewords@example.com',
                        'verified': false
                    }
                ],
                'completeness': 27,
                'profile': {
                    'name': 'Adilet Jocelyn Noguerra',
                    'normalized_name': 'adilet jocelyn noguerra',
                    'settings': {
                        'locale': 'en',
                        'optionalDetailsCompleted': true,
                        'email': {
                            'dailydigest': true,
                            'upper_mentioned_in_partup': true,
                            'upper_mentioned_in_network_chat': true,
                            'invite_upper_to_partup_activity': true,
                            'invite_upper_to_network': true,
                            'partup_created_in_network': true,
                            'partups_networks_new_pending_upper': true,
                            'partups_networks_accepted': true,
                            'partups_new_comment_in_involved_conversation': true,
                            'partups_networks_new_upper': true,
                            'partups_networks_upper_left': true
                        },
                        'unsubscribe_email_token': 'WiYdZ-AoYintHgYofjIlOyWTsP8f2oNKLhh3jhhpIdN'
                    },
                    'image': 'bMTGT9oSDGzxCL3r4',
                    'description': null,
                    'tags': [
                        'design',
                        'ux',
                        'photography',
                        'nonprofit'
                    ],
                    'location': {
                        'city': 'Maastricht',
                        'lat': 50.8513682000000031,
                        'lng': 5.6909725000000000,
                        'place_id': 'ChIJnwZBWOzpwEcRbqi-zHuV61M',
                        'country': 'Netherlands'
                    },
                    'facebook_url': null,
                    'twitter_url': null,
                    'instagram_url': null,
                    'linkedin_url': null,
                    'phonenumber': null,
                    'website': '',
                    'skype': null,
                },
                'status': {
                    'online': true,
                    'lastLogin': {
                        'date': new Date('2015-07-21T14:11:01.089Z'),
                        'ipAddr': '127.0.0.1',
                        'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
                    },
                    'idle': false
                },
                'registered_emails': [
                    {
                        'address': 'threewords@example.com',
                        'verified': false
                    }
                ],
                'logins': [
                    new Date('2015-07-21T14:11:01.103Z')
                ],
                'participation_score': 3,
                'pending_networks': [
                    'wfCv4ZdPe5WNT4xfg'
                ],
                'networks': [
                    'ibn27M3ePaXhmKzWq'
                ],
                'upperOf': [
                    'vGaxNojSerdizDPjb',
                    'vGaxNojSerdizDPjd'
                ],
                'supporterOf': [
                    'gJngF65ZWyS9f3NDE'
                ],
                'flags': {
                    'dailyDigestEmailHasBeenSent': false
                }
            });

            Meteor.users.insert({
                '_id': 'efh2F9LHJwNPqvzKU',
                'createdAt': new Date('2017-05-21T14:11:01.053Z'),
                'services': {
                    'password': {
                        'bcrypt': '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG'
                    },
                    'resume': {
                        'loginTokens': [
                            {
                                'when': new Date('2015-07-21T14:11:01.061Z'),
                                'hashedToken': 'QR5jRUOgOYNkrUZNjPdYicokC8hggzWimey9ccMMSG0='
                            }
                        ]
                    },
                    'email': {
                        'verificationTokens': [
                            {
                                'token': 'X0BHuAeVNCWozOenCRTdXltEXE1kPB0VZBriz39Src6',
                                'address': 'veryspecial@example.com',
                                'when': new Date('2015-07-21T14:11:06.055Z')
                            }
                        ]
                    }
                },
                'emails': [
                    {
                        'address': 'veryspecial@example.com',
                        'verified': false
                    }
                ],
                'completeness': 27,
                'profile': {
                    'name': 'àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ',
                    'normalized_name': 'àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ',
                    'settings': {
                        'locale': 'en',
                        'optionalDetailsCompleted': true,
                        'email': {
                            'dailydigest': true,
                            'upper_mentioned_in_partup': true,
                            'upper_mentioned_in_network_chat': true,
                            'invite_upper_to_partup_activity': true,
                            'invite_upper_to_network': true,
                            'partup_created_in_network': true,
                            'partups_networks_new_pending_upper': true,
                            'partups_networks_accepted': true,
                            'partups_new_comment_in_involved_conversation': true,
                            'partups_networks_new_upper': true,
                            'partups_networks_upper_left': true
                        },
                        'unsubscribe_email_token': 'WiYdZ-AoYintHgYofjIlOyWTsP8f2oNKLhh3jhhpIdX'
                    },
                    'image': 'bMTGT9oSDGzxCL3r4',
                    'description': null,
                    'tags': [
                        'design',
                        'ux',
                        'photography',
                        'nonprofit'
                    ],
                    'location': {
                        'city': 'Maastricht',
                        'lat': 50.8513682000000031,
                        'lng': 5.6909725000000000,
                        'place_id': 'ChIJnwZBWOzpwEcRbqi-zHuV61M',
                        'country': 'Netherlands'
                    },
                    'facebook_url': null,
                    'twitter_url': null,
                    'instagram_url': null,
                    'linkedin_url': null,
                    'phonenumber': null,
                    'website': '',
                    'skype': null,
                    'meurs': {
                        'portal': 'en',
                        'nl_id': 'f8cb5c45-bdb5-4a98-9f98-a7d5fdcd7115',
                        'en_id': '503a6931-4a68-4595-83fa-4e77098727cc',
                        'program_session_id': 32698,
                        'fetched_results': true,
                        'results': [
                            {
                                'code': 103401,
                                'name': 'Denkkracht',
                                'score': 9,
                                'zscore': 0.90003,
                                'dscore': 8,
                                'highIndex': 1
                            },
                            {
                                'code': 103405,
                                'name': 'Persoonlijke kracht',
                                'score': 7,
                                'zscore': 0.7000400000000001,
                                'dscore': 6,
                                'highIndex': 1
                            }
                        ]
                    }
                },
                'status': {
                    'online': true,
                    'lastLogin': {
                        'date': new Date('2015-07-21T14:11:01.089Z'),
                        'ipAddr': '127.0.0.1',
                        'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
                    },
                    'idle': false
                },
                'registered_emails': [
                    {
                        'address': 'specialchars@example.com',
                        'verified': false
                    }
                ],
                'logins': [
                    new Date('2015-07-21T14:11:01.103Z')
                ],
                'participation_score': 3,
                'pending_networks': [
                    'wfCv4ZdPe5WNT4xfg'
                ],
                'networks': [
                    'ibn27M3ePaXhmKzWq'
                ],
                'upperOf': [
                    'vGaxNojSerdizDPjb',
                    'vGaxNojSerdizDPjd'
                ],
                'supporterOf': [
                    'gJngF65ZWyS9f3NDE'
                ],
                'flags': {
                    'dailyDigestEmailHasBeenSent': false
                }
            });


            for (var i = 0; i < 15; i++) {
                var name = Fake.fromArray([Fake.word(), Fake.word(), Fake.word(), Fake.word()]) + (Math.random(100) > 50 ? Fake.fromArray([Fake.word(), Fake.word(), Fake.word(), Fake.word()]) + Fake.fromArray([Fake.word(), Fake.word(), Fake.word(), Fake.word()]) : Fake.fromArray([Fake.word(), Fake.word(), Fake.word(), Fake.word()]))
                var email = name.replace(' ', '') +'@example.com';
                Meteor.users.insert({
                    'createdAt': new Date(),
                    'services': {
                        'password': {
                            'bcrypt': '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG'
                        },
                        'resume': {
                            'loginTokens': [
                                {
                                    'when': new Date('2015-07-21T13:48:03.566Z'),
                                    'hashedToken': 'vctK9ULMl4Gdegbr+73LED8So83rPz67Xi6KnnNQCV' + i + '='
                                }
                            ]
                        },
                        'email': {
                            'verificationTokens': [
                                {
                                    'token': '8crlkpFefwhO_RdgJbnV-8q4S-_M0yfjFsn--YYh4Y' + i,
                                    'address': email,
                                    'when': new Date('2015-07-21T13:48:08.563Z')
                                }
                            ]
                        }
                    },
                    'emails': [
                        {
                            'address': email,
                            'verified': false
                        }
                    ],
                    'completeness': 27,
                    'profile': {
                        'name': name,
                        'normalized_name': name.toLowerCase(),
                        'settings': {
                            'locale': 'en',
                            'optionalDetailsCompleted': true,
                            'email': {
                                'dailydigest': true,
                                'upper_mentioned_in_partup': true,
                                'upper_mentioned_in_network_chat': true,
                                'invite_upper_to_partup_activity': true,
                                'invite_upper_to_network': true,
                                'partup_created_in_network': true,
                                'partups_networks_new_pending_upper': true,
                                'partups_networks_accepted': true,
                                'partups_new_comment_in_involved_conversation': true,
                                'partups_networks_new_upper': true,
                                'partups_networks_upper_left': true
                            },
                            'unsubscribe_email_token': 'Xr_FQVj16IQRwpoMxQOWgHMVr5z6Jd04wpvF00n6rK' + i
                        },
                        'image': 'CxEprGKNWo6HdrTdq',
                        'description': null,
                        'tags': [
                            'administration',
                            'finance'
                        ],
                        'location': {
                            'city': 'Utrecht',
                            'lat': 52.0907373999999876,
                            'lng': 5.1214200999999999,
                            'place_id': 'ChIJNy3TOUNvxkcR6UqvGUz8yNY',
                            'country': 'Netherlands'
                        },
                        'facebook_url': null,
                        'twitter_url': null,
                        'instagram_url': null,
                        'linkedin_url': null,
                        'phonenumber': null,
                        'website': '',
                        'skype': null,
                        'meurs': {
                            'portal': 'en',
                            'nl_id': '44e74f98-fd0f-4c9a-82e1-82e1528409f5',
                            'en_id': 'b7b44c5b-36f9-4c88-a2a7-3b3aa8709255',
                            'program_session_id': 32724,
                            'fetched_results': true,
                            'results': [
                                {
                                    'code': 103405,
                                    'name': 'Persoonlijke kracht',
                                    'score': 8,
                                    'zscore': 0.8000400000000001,
                                    'dscore': 7,
                                    'highIndex': 1
                                },
                                {
                                    'code': 103402,
                                    'name': 'Stuurkracht',
                                    'score': 7,
                                    'zscore': 0.7000500000000001,
                                    'dscore': 6,
                                    'highIndex': 1
                                }
                            ]
                        }
                    },
                    'status': {
                        'online': true,
                        'lastLogin': {
                            'date': new Date('2015-07-21T13:48:03.623Z'),
                            'ipAddr': '127.0.0.1',
                            'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
                        },
                        'idle': false
                    },
                    'registered_emails': [
                        {
                            'address': 'test@example.com',
                            'verified': false
                        }
                    ],
                    'logins': [
                        new Date('2015-07-21T13:48:03.641Z')
                    ],
                    'networks': [
                        'nqBnE8nSLasaapXXS',
                        'kRCjWDBkKru3KfsjW',
                        'wfCv4ZdPe5WNT4xfg',
                        'ibn27M3ePaXhmKzWq'
                    ],
                    'participation_score': 2,
                    'flags': {
                        'dailyDigestEmailHasBeenSent': false
                    }
                });
            }
        }

    }
});
