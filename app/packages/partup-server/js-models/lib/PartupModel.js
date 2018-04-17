'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Model2 = require('./lib/Model');

var _Model3 = _interopRequireDefault(_Model2);

var _index = require('../js-helpers/lib/index');

var _array = require('mout/array');

var _object = require('mout/object');

var _ImageModel = require('./ImageModel');

var _ImageModel2 = _interopRequireDefault(_ImageModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PartupModel = function (_Model) {
    _inherits(PartupModel, _Model);

    function PartupModel() {
        _classCallCheck(this, PartupModel);

        return _possibleConstructorReturn(this, (PartupModel.__proto__ || Object.getPrototypeOf(PartupModel)).apply(this, arguments));
    }

    _createClass(PartupModel, [{
        key: 'getImage',


        /**
         * Get partup image
         *
         * @return {ImageModel}
         */
        value: function getImage() {
            return _ImageModel2.default.findOne({ _id: this.image });
        }

        /**
         * Get website url for partup
         *
         * @returns {String}
         */

    }, {
        key: 'getWebsiteUrl',
        value: function getWebsiteUrl() {
            return PartupModel.settings.makeAbsoluteUrl({
                pathname: (0, _index.getWebsitePathFor)('partup', { slug: this.slug })
            });
        }

        /**
         * Get new updates count
         *
         * @returns {Number}
         */

    }, {
        key: 'getNewUpdatesCount',
        value: function getNewUpdatesCount(userId) {
            if (!this.upper_data) {
                return 0;
            }

            var upperData = (0, _array.find)(this.upper_data, function (d) {
                return d._id === userId;
            }) || {};
            return (0, _object.get)(upperData, 'new_updates.length') || 0;
        }
    }]);

    return PartupModel;
}(_Model3.default);

exports.default = PartupModel;
module.exports = exports['default'];