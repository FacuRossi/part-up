'use strict';

import check from 'powercheck';
import Model from './lib/Model';
import UserModel from './UserModel';

export default class ChatModel extends Model {
    /**
     * Search private chats for user
     *
     * @param user {UserModel}
     * @returns object
     */
    static searchPrivateForUser(user) {
        check.throw(user, UserModel);

        return {
            selector: {
                _id: {
                    $in: user.chats || []
                }
            },
            options: {
                sort: {
                    updated_at: -1
                }
            }
        };
    }

    getUnreadCountForUser(user) {
        check.throw(user, UserModel);

        const userCount = this.counter.find(c => c.user_id === user._id) || {};
        return userCount.unread_count || 0;
    }
}
