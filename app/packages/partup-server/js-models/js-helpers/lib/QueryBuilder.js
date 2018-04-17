'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lang = require('mout/lang');

var _object = require('mout/object');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueryBuilder = function () {
    function QueryBuilder(collection) {
        _classCallCheck(this, QueryBuilder);

        this._collection = collection;
        this._selectors = [];
        this._options = {};
        this._fields = {};
        this._criteria = [];
        this._none = false;
    }

    /**
     * The fields you want to retrieve
     * (or a function returning those)
     */


    _createClass(QueryBuilder, [{
        key: 'fields',
        value: function fields() {
            var f = void 0;

            // In case it's a function

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if ((0, _lang.isFunction)(args[0])) {
                f = args[0].call(this._collection, this._collection) || {};
            }

            // In case it's not
            else {
                    f = args[0] || {};
                }

            // Merge fields
            (0, _object.mixIn)(this._fields, f);

            // Chain
            return this;
        }

        /**
         * Selector and options
         * (or a function returning those)
         */

    }, {
        key: 'search',
        value: function search() {
            var s = void 0;
            var o = void 0;

            // In case it's a function

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            if ((0, _lang.isFunction)(args[0])) {
                var q = args[0].call(this._collection, this._collection) || {};
                s = q.selector;
                o = q.options;
            }

            // In case it's not
            else {
                    s = args[0];
                    o = args[1];
                }

            // In case the selector is not an object, assume it's an _id
            if (!(0, _lang.isObject)(s)) {
                s = { _id: s };
            }

            // Push selector if not empty
            if ((0, _lang.isObject)(s) && (0, _object.keys)(s).length > 0) {
                this._selectors.push(s);
            }

            if ((0, _lang.isObject)(o)) {

                // Ignore fields
                delete o.fields;

                // Deep merge options
                (0, _object.deepMixIn)(this._options, o);
            }

            // Chain
            return this;
        }

        /**
         * Selector criteria
         * (or a function returning those)
         * (or a boolean)
         */

    }, {
        key: 'criteria',
        value: function criteria(sc) {

            // In case it's a function, call it
            if ((0, _lang.isFunction)(sc)) {
                sc = sc.call(this._collection, this._collection);
            }

            // In case it's "false", make sure find() will return false
            if ((0, _lang.isBoolean)(sc)) {
                if (!sc) {
                    this._none = true;
                }
            }

            // Else, in case the selector is not an object, assume it's an _id
            else if (!(0, _lang.isObject)(sc)) {
                    sc = {
                        _id: (0, _lang.isString)(sc) ? sc : { $in: [] }
                    };
                }

            // Push the selector
            if ((0, _lang.isObject)(sc)) {
                this._criteria.push(sc);
            }

            // Chain
            return this;
        }

        /**
         * Perform a Mongo find
         */

    }, {
        key: 'find',
        value: function find() {
            if (this._none) {
                return false;
            }

            var s = {};
            var o = {};

            // Compose selector from this._selectors and this._criteria
            if (this._selectors.length > 0 || this._criteria.length > 0) {
                s.$and = [];
                this._criteria.forEach(function (c) {
                    return s.$and.push(c);
                });

                if (this._selectors.length > 0) {
                    s.$and.push({
                        $or: this._selectors
                    });
                }
            }

            // Compose options from this._options and this._fields
            (0, _object.mixIn)(o, this._options, { fields: this._fields });

            // Return Mongo cursor from s and o
            return this._collection.find(s, o);
        }

        /**
         * Helper to find and fetch
         */

    }, {
        key: 'fetch',
        value: function fetch() {
            return this.find().fetch();
        }

        /**
         * Helper to find and count
         */

    }, {
        key: 'count',
        value: function count() {
            return this.find().count();
        }

        /**
         * Helper to find and fetch one
         */

    }, {
        key: 'findOne',
        value: function findOne() {
            return this.find().fetch().shift();
        }
    }]);

    return QueryBuilder;
}();

exports.default = QueryBuilder;
;
module.exports = exports['default'];