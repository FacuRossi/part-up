'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _powercheck = require('powercheck');

var _powercheck2 = _interopRequireDefault(_powercheck);

var _Model2 = require('./lib/Model');

var _Model3 = _interopRequireDefault(_Model2);

var _UserModel = require('./UserModel');

var _UserModel2 = _interopRequireDefault(_UserModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChatModel = function (_Model) {
    _inherits(ChatModel, _Model);

    function ChatModel() {
        _classCallCheck(this, ChatModel);

        return _possibleConstructorReturn(this, (ChatModel.__proto__ || Object.getPrototypeOf(ChatModel)).apply(this, arguments));
    }

    _createClass(ChatModel, [{
        key: 'getUnreadCountForUser',
        value: function getUnreadCountForUser(user) {
            _powercheck2.default.throw(user, _UserModel2.default);

            var userCount = this.counter.find(function (c) {
                return c.user_id === user._id;
            }) || {};
            return userCount.unread_count || 0;
        }
    }], [{
        key: 'searchPrivateForUser',

        /**
         * Search private chats for user
         *
         * @param user {UserModel}
         * @returns object
         */
        value: function searchPrivateForUser(user) {
            _powercheck2.default.throw(user, _UserModel2.default);

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
    }]);

    return ChatModel;
}(_Model3.default);

exports.default = ChatModel;
module.exports = exports['default'];