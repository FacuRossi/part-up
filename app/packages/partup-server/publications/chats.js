var NETWORK_FIELDS = {
    name: 1,
    slug: 1,
    chat_id: 1,
    image: 1,
    admins: 1,
    uppers: 1
};

var userChatFields = function() {
    return {
        'profile.image': 1,
        'profile.name': 1,
        'status.online': 1,
        'networks': 1,
        'chats': 1
    };
};

var latestChatMessageOptions = {
    sort: {
        created_at: -1
    },
    limit: 1,
    fields: {
        _id: 1,
        chat_id: 1,
        content: 1,
        created_at: 1,
        creator_id: 1
    }
};

Meteor.publishComposite('chats.for_loggedin_user', function(parameters, options) {
    this.unblock();

    // FIXME: hack is necessary for backwards compatibility. please remove after app 1.2.3 publication
    if (!options) {
        options = parameters;
        parameters = {private: true};
    }

    parameters = parameters || {};
    options = options || {};
    check(parameters, {
        private: Match.Optional(Boolean),
        networks: Match.Optional(Boolean)
    });
    check(options, {
        limit: Match.Optional(Number),
        skip: Match.Optional(Number)
    });

    var chatOptions = options;
    chatOptions.fields = {
        _id: 1,
        updated_at: 1,
        created_at: 1,
        counter: 1
    };

    return {
        find: function() {
            return Meteor.users.findSinglePrivateProfile(this.userId);
        },
        children: [

            /**
             * All network chats + children
             */

            {
                find: function(user) {
                    if (!parameters.networks) return;
                    return Networks.findUnarchivedForUser(user, user._id, {
                        fields: NETWORK_FIELDS,
                        skip: chatOptions.skip,
                        limit: chatOptions.limit
                    });
                },
                children: [
                    {find: Images.findForNetwork},
                    {
                        // Network chats
                        find: function(network) {
                            return Chats.find(network.chat_id, {fields: chatOptions.fields});
                        },
                        children: [{
                            // Latest chatmessage
                            find: function(chat) {
                                return ChatMessages.find({chat_id: chat._id}, latestChatMessageOptions);
                            },
                            children: [
                                {
                                    // Chatmessage User
                                    find: function(chatMessage, chat) {
                                        return Meteor.users.find({
                                            _id: chatMessage.creator_id
                                        }, {
                                            fields: userChatFields(),
                                        });
                                    },
                                    children: [{
                                        find: Images.findForUser
                                    }]
                                }
                            ]
                        }]
                    }
                ]
            },

            /**
             * All private chats + children
             */
            {
                find: function(user) {
                    if (!parameters.private) return;
                    return Chats.findForUser(user._id, {private: true}, chatOptions);
                },
                children: [{
                    find: function(chat) {
                        return Meteor.users.find({
                            _id: { $nin: [this.userId] },
                            chats: { $in: [chat._id] }
                        }, {
                            fields: userChatFields(),
                        });
                    },
                    children: [{
                        find: Images.findForUser
                    }]
                },{
                    // Latest chatmessage
                    find: function(chat) {
                        return ChatMessages.find({chat_id: chat._id}, latestChatMessageOptions);
                    }
                    // no User publication for ChatMessage is required, since this publication already publishes all the chat users
                }]
            }
        ]
    };
});

Meteor.publishComposite('chats.one_on_one', function() {
    return {
        find: function() {
            return Meteor.users.find({_id: this.userId});
        },
        children: [{
            find: function(user) {
                if (!user) return;
                return Chats.find({_id: {$in: user.chats || []}}, {fields: {_id: 1}});
            }
        }]
    }
});

Meteor.publishComposite('chats.for_loggedin_user.unread_count', function(chatIds) {
    var chatIds = chatIds || [];
    return {
        find: function() {
            return Chats.find({_id: {$in: chatIds}}, {fields: {counter: 1, updated_at: 1}});
        },
        children: [{
            find: function(chat) {
                return ChatMessages.find({chat_id: chat._id}, latestChatMessageOptions);
            }
        }]
    }
});

Meteor.routeComposite('/chats/userdata', function(request, parameters) {
    var chatOptions = {};
    chatOptions.fields = {
        _id: 1,
        updated_at: 1,
    };
    // console.log(request.user)
    var userId = request.user._id;
    var user = Meteor.users.findOne({_id: userId});
    var chatCursor = Chats.findForUser(userId, { networks: true, private: true }, {fields: {_id: 1, 'profile.image': 1}});
    var usersCursor = Meteor.users.find({ chats: {$in: user.chats || []}, _id: {$nin: [userId]}}, { fields: userChatFields()});
    var networksCursor = Networks.findForUser(user, userId, {fields: {chat_id: 1, name: 1, slug: 1, image: 1}});
    var imagesCursor = Images.findForCursors([{
        imageKey: 'profile.image',
        cursor: usersCursor,
    }, {
        imageKey: 'image',
        cursor: networksCursor,
    }], {
        fields: {
            'copies.80x80': 1,
        }
    });
    return {
        find: function() {
            return Meteor.users.find({_id: this.userId});
        },
        children: [{
            find: function(user) {
                return chatCursor;
            }
        }, {
            find: function(user) {
                return usersCursor;
            },
        }, {
            find: function(user) {
                return networksCursor;
            },
        }, {
            find: function(user) {
                return imagesCursor;
            }
        }]
    };
});

Meteor.publishComposite('chats.for_loggedin_user.for_count', function(parameters, options) {
    this.unblock();

    parameters = parameters || {};
    check(parameters, {
        private: Match.Optional(Boolean),
        networks: Match.Optional(Boolean)
    });

    return {
        find: function() {
            return Meteor.users.findSinglePrivateProfile(this.userId);
        },
        children: [{
            find: function(user) {
                return Chats.findForUser(user._id, parameters, options);
            },
            children: [{
                find: function(chat, user) {
                    return Networks.find({chat_id: chat._id}, {fields: NETWORK_FIELDS, limit: 1});
                },
                children: [
                    {find: Images.findForNetwork}
                ]
            }]
        }]
    };
});

Meteor.publishComposite('chats.by_id', function(chatId, chatMessagesOptions) {
    this.unblock();
    check(chatId, String);
    chatMessagesOptions = chatMessagesOptions || {};
    check(chatMessagesOptions, {
        limit: Match.Optional(Number),
        skip: Match.Optional(Number)
    });

    chatMessagesOptions.fields = {
        _id: 1,
        chat_id: 1,
        content: 1,
        created_at: 1,
        creator_id: 1,
        preview_data: 1
    };

    return {
        find: function() {
            return Meteor.users.findSinglePrivateProfile(this.userId);
        },
        children: [
            {
                find: function(user) {
                    if (user.chats && user.chats.indexOf(chatId) === -1) return;
                    return Chats.findOneForUser(this.userId, chatId, {});
                },
                children: [
                    {
                        find: function(chat) {
                            return Meteor.users.findMultiplePublicProfiles([], {}, {hackyReplaceSelectorWithChatId: chat._id});
                        },
                        children: [
                            {find: Images.findForUser}
                        ]
                    },
                    {
                        find: function(chat) {
                            chatMessagesOptions.sort = {created_at: -1};
                            return ChatMessages.find({chat_id: chat._id}, chatMessagesOptions);
                        }
                        // no User publication for ChatMessage is required, since this publication already publishes all the chat users
                    }
                ]
            }
        ]
    };
});

Meteor.publishComposite('chats.by_id.for_web', function(chatId, chatMessagesOptions) {
    this.unblock();
    if (!chatId) return; // Return if no chat specified in the URL
    check(chatId, String);

    // Prevent users to navigate to chats that arent theirs.
    const user = Meteor.users.findOne(this.userId);
    if (!user || user.chats.indexOf(chatId) === -1) {
      return this.ready();
    }

    chatMessagesOptions = chatMessagesOptions || {};
    check(chatMessagesOptions, {
        limit: Match.Optional(Number),
        skip: Match.Optional(Number)
    });

    chatMessagesOptions.fields = {
        _id: 1,
        chat_id: 1,
        content: 1,
        created_at: 1,
        creator_id: 1,
        preview_data: 1
    };
    var usersCursor = Meteor.users.findMultiplePublicProfiles([], {}, {hackyReplaceSelectorWithChatId: chatId});
    return {
        find: function() {
            return Chats.findOneForUser(this.userId, chatId, {});
        },
        children: [{
            find: function(chat) {
                chatMessagesOptions.sort = {created_at: -1};
                return ChatMessages.find({chat_id: chat._id}, chatMessagesOptions);
            },
        }, {
            find: function(chat) {
                return usersCursor;
            }
        }, {
            find: function(chat) {
                var imageIds = usersCursor.map(function(user) {
                    return lodash.get(user, 'profile.image');
                });
                return Images.find({_id: { $in: imageIds}}, {fields: {'copies.80x80': 1}})
            }
        }],
    };
});
