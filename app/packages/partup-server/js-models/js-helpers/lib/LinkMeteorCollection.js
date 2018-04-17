'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lang = require('mout/lang');

var _lodash = require('lodash');

var _QueryBuilder = require('./QueryBuilder');

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinkMeteorCollection = function () {
    function LinkMeteorCollection(Mongo, connection) {
        _classCallCheck(this, LinkMeteorCollection);

        this.Mongo = Mongo;
        this.connection = connection;
    }

    _createClass(LinkMeteorCollection, [{
        key: 'link',
        value: function link(Model, collection) {
            if (typeof collection !== 'string' && !(collection instanceof this.Mongo.Collection)) {
                throw new Error('collection must be a string or an instance of Mongo.Collection');
            }

            var c = collection;

            // Create Mongo collection
            if ((0, _lang.isString)(collection)) {
                c = new this.Mongo.Collection(c, {
                    connection: this.connection
                });
            }

            // Transform document to extend opts.Document
            c._transform = function (doc) {
                return new Model(doc);
            };

            // Define query builder
            c.query = function () {
                return new _QueryBuilder2.default(Model);
            };

            // Extend model with the collection
            (0, _lodash.extend)(Model, c);
        }
    }]);

    return LinkMeteorCollection;
}();

exports.default = LinkMeteorCollection;
module.exports = exports['default'];