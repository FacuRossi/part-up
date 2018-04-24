'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Model2 = require('./lib/Model');

var _Model3 = _interopRequireDefault(_Model2);

var _UserModel = require('./UserModel');

var _UserModel2 = _interopRequireDefault(_UserModel);

var _PartupModel = require('./PartupModel');

var _PartupModel2 = _interopRequireDefault(_PartupModel);

var _powercheck = require('powercheck');

var _powercheck2 = _interopRequireDefault(_powercheck);

var _index = require('../js-helpers/lib/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PartupUpdateModel = function (_Model) {
    _inherits(PartupUpdateModel, _Model);

    function PartupUpdateModel() {
        _classCallCheck(this, PartupUpdateModel);

        return _possibleConstructorReturn(this, (PartupUpdateModel.__proto__ || Object.getPrototypeOf(PartupUpdateModel)).apply(this, arguments));
    }

    _createClass(PartupUpdateModel, [{
        key: 'isActivityRelated',
        value: function isActivityRelated() {
            return (/^partups_(activities|contributions|ratings)/.test(this.type) || this.type === 'partups_comments_added'
            );
        }

        /**
         * Get part-up
         */

    }, {
        key: 'getPartup',
        value: function getPartup() {
            return _PartupModel2.default.findOne(this.partup_id);
        }

        /**
         * Get meta text for update (date and partup name)
         *
         * @param {Function} t - i18next's translator function
         * @param {Date} nowDate
         */

    }, {
        key: 'getMetaText',
        value: function getMetaText(t, nowDate) {
            _powercheck2.default.throw(t, Function);
            _powercheck2.default.throw(nowDate, Date);

            var partup = this.getPartup();
            _powercheck2.default.throw(partup, _PartupModel2.default);

            return t('update-metatext', {
                time: _index.formatDate.relativeWithThreshold(this.updated_at, nowDate),
                location: partup.name
            });
        }
    }], [{
        key: 'getUserForComment',
        value: function getUserForComment(comment) {
            return new _UserModel2.default({
                _id: comment.creator._id,
                profile: {
                    name: comment.creator.name,
                    image: comment.creator.image
                }
            });
        }
    }]);

    return PartupUpdateModel;
}(_Model3.default);

exports.default = PartupUpdateModel;
module.exports = exports['default'];