'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Model2 = require('./lib/Model');

var _Model3 = _interopRequireDefault(_Model2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CountModel = function (_Model) {
  _inherits(CountModel, _Model);

  function CountModel() {
    _classCallCheck(this, CountModel);

    return _possibleConstructorReturn(this, (CountModel.__proto__ || Object.getPrototypeOf(CountModel)).apply(this, arguments));
  }

  return CountModel;
}(_Model3.default);

exports.default = CountModel;
module.exports = exports['default'];