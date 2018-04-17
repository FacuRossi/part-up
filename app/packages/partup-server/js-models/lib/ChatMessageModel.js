'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _powercheck = require('powercheck');

var _powercheck2 = _interopRequireDefault(_powercheck);

var _Model2 = require('./lib/Model');

var _Model3 = _interopRequireDefault(_Model2);

var _ChatModel = require('./ChatModel');

var _ChatModel2 = _interopRequireDefault(_ChatModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChatMessageModel = function (_Model) {
    _inherits(ChatMessageModel, _Model);

    function ChatMessageModel() {
        _classCallCheck(this, ChatMessageModel);

        return _possibleConstructorReturn(this, (ChatMessageModel.__proto__ || Object.getPrototypeOf(ChatMessageModel)).apply(this, arguments));
    }

    _createClass(ChatMessageModel, null, [{
        key: 'searchForChat',

        /**
         * Search messages for chat
         *
         * @param chat {ChatModel}
         * @returns object
         */
        value: function searchForChat(chat) {
            _powercheck2.default.throw(chat, _ChatModel2.default);

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
    }]);

    return ChatMessageModel;
}(_Model3.default);

exports.default = ChatMessageModel;
module.exports = exports['default'];