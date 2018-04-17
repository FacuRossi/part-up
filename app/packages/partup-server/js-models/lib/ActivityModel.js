'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Model2 = require('./lib/Model');

var _Model3 = _interopRequireDefault(_Model2);

var _powercheck = require('powercheck');

var _powercheck2 = _interopRequireDefault(_powercheck);

var _object = require('mout/object');

var _PartupUpdateModel = require('./PartupUpdateModel');

var _PartupUpdateModel2 = _interopRequireDefault(_PartupUpdateModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActivityModel = function (_Model) {
    _inherits(ActivityModel, _Model);

    function ActivityModel() {
        _classCallCheck(this, ActivityModel);

        return _possibleConstructorReturn(this, (ActivityModel.__proto__ || Object.getPrototypeOf(ActivityModel)).apply(this, arguments));
    }

    _createClass(ActivityModel, null, [{
        key: 'searchForPartupUpdate',

        /**
         * Search activity for update
         *
         * @param update {PartupUpdateModel}
         * @returns object
         */
        value: function searchForPartupUpdate(partupUpdate) {
            _powercheck2.default.throw(partupUpdate, _PartupUpdateModel2.default);

            return {
                selector: {
                    _id: (0, _object.get)(partupUpdate.type_data, 'activity_id')
                },
                options: {}
            };
        }
    }]);

    return ActivityModel;
}(_Model3.default);

exports.default = ActivityModel;
module.exports = exports['default'];