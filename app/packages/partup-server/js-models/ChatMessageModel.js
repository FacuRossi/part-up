'use strict';

import check from 'powercheck';
import Model from './lib/Model';
import ChatModel from './ChatModel';

export default class ChatMessageModel extends Model {
    /**
     * Search messages for chat
     *
     * @param chat {ChatModel}
     * @returns object
     */
    static searchForChat(chat) {
        check.throw(chat, ChatModel);

        return {
            selector: {
                chat_id: chat._id
            },
            options: {
                sort: {
                    created_at: -1
                }
            }
        };
    }
}
