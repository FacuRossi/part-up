'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Model2 = require('./lib/Model');

var _Model3 = _interopRequireDefault(_Model2);

var _ImageModel = require('./ImageModel');

var _ImageModel2 = _interopRequireDefault(_ImageModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserModel = function (_Model) {
    _inherits(UserModel, _Model);

    function UserModel() {
        _classCallCheck(this, UserModel);

        return _possibleConstructorReturn(this, (UserModel.__proto__ || Object.getPrototypeOf(UserModel)).apply(this, arguments));
    }

    _createClass(UserModel, [{
        key: 'getFirstname',


        /**
         * Get the first name of a user
         *
         * @return {String}
         */
        value: function getFirstname() {
            return this.profile.firstname || this.profile.name.split(' ').shift();
        }

        /**
         * Get the avatar image
         *
         * @return {ImageModel}
         */

    }, {
        key: 'getAvatarImage',
        value: function getAvatarImage() {
            return this.profile.image && _ImageModel2.default.findOne({ _id: this.profile.image });
        }

        /**
         * Get the user score
         *
         * @return {Number} rounded and bounded participation score
         */

    }, {
        key: 'getScore',
        value: function getScore() {
            var score = this.participation_score ? this.participation_score : 0;

            // For design purposes, we only want to display
            // a max value of 99 and a min value of 10,
            // every number should be a natural one
            score = Math.min(99, score);
            score = Math.max(10, score);
            score = Math.round(score);

            return score;
        }
    }]);

    return UserModel;
}(_Model3.default);

exports.default = UserModel;
module.exports = exports['default'];