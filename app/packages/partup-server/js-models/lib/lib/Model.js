'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
    function Model(doc) {
        _classCallCheck(this, Model);

        (0, _lodash.extend)(this, doc);
    }

    /**
     * Check equality between documents
     *
     * @param {Object} doc
     */


    _createClass(Model, [{
        key: 'equals',
        value: function equals(doc) {
            return this._id === doc._id;
        }
    }]);

    return Model;
}();

exports.default = Model;


Model.settings = {};
module.exports = exports['default'];