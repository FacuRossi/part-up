'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Model2 = require('./lib/Model');

var _Model3 = _interopRequireDefault(_Model2);

var _partUpJsHelpers = require('part-up-js-helpers');

var _ImageModel = require('./ImageModel');

var _ImageModel2 = _interopRequireDefault(_ImageModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NetworkModel = function (_Model) {
    _inherits(NetworkModel, _Model);

    function NetworkModel() {
        _classCallCheck(this, NetworkModel);

        return _possibleConstructorReturn(this, (NetworkModel.__proto__ || Object.getPrototypeOf(NetworkModel)).apply(this, arguments));
    }

    _createClass(NetworkModel, [{
        key: 'getImage',


        /**
         * Get network image
         *
         * @return {ImageModel}
         */
        value: function getImage() {
            return _ImageModel2.default.findOne({ _id: this.image });
        }

        /**
         * Get website url for network
         *
         * @returns {String}
         */

    }, {
        key: 'getWebsiteUrl',
        value: function getWebsiteUrl() {
            var pathname = (0, _partUpJsHelpers.getWebsitePathFor)('network', { slug: this.slug });
            return NetworkModel.settings.makeAbsoluteUrl({ pathname: pathname });
        }
    }]);

    return NetworkModel;
}(_Model3.default);

exports.default = NetworkModel;
module.exports = exports['default'];