'use strict';

import { isFunction, isObject, isString, isBoolean } from 'mout/lang';
import { mixIn, deepMixIn, keys } from 'mout/object';

export default class QueryBuilder {
    constructor(collection) {
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
    fields(...args) {
        let f;

        // In case it's a function
        if (isFunction(args[0])) {
            f = args[0].call(this._collection, this._collection) || {};
        }

        // In case it's not
        else {
            f = args[0] || {};
        }

        // Merge fields
        mixIn(this._fields, f);

        // Chain
        return this;
    }

    /**
     * Selector and options
     * (or a function returning those)
     */
    search(...args) {
        let s;
        let o;

        // In case it's a function
        if (isFunction(args[0])) {
            const q = args[0].call(this._collection, this._collection) || {};
            s = q.selector;
            o = q.options;
        }

        // In case it's not
        else {
            s = args[0];
            o = args[1];
        }

        // In case the selector is not an object, assume it's an _id
        if (!isObject(s)) {
            s = {_id: s};
        }

        // Push selector if not empty
        if (isObject(s) && keys(s).length > 0) {
            this._selectors.push(s);
        }

        if (isObject(o)) {

            // Ignore fields
            delete o.fields;

            // Deep merge options
            deepMixIn(this._options, o);
        }

        // Chain
        return this;
    }

    /**
     * Selector criteria
     * (or a function returning those)
     * (or a boolean)
     */
    criteria(sc) {

        // In case it's a function, call it
        if (isFunction(sc)) {
            sc = sc.call(this._collection, this._collection);
        }

        // In case it's "false", make sure find() will return false
        if (isBoolean(sc)) {
            if (!sc) {
                this._none = true;
            }
        }

        // Else, in case the selector is not an object, assume it's an _id
        else if (!isObject(sc)) {
            sc = {
                _id: isString(sc) ? sc : {$in: []}
            };
        }

        // Push the selector
        if (isObject(sc)) {
            this._criteria.push(sc);
        }

        // Chain
        return this;
    }

    /**
     * Perform a Mongo find
     */
    find() {
        if (this._none) {
            return false;
        }

        let s = {};
        let o = {};

        // Compose selector from this._selectors and this._criteria
        if (this._selectors.length > 0 || this._criteria.length > 0) {
            s.$and = [];
            this._criteria.forEach(c => s.$and.push(c));

            if (this._selectors.length > 0) {
                s.$and.push({
                    $or: this._selectors
                });
            }
        }

        // Compose options from this._options and this._fields
        mixIn(o, this._options, {fields: this._fields});

        // Return Mongo cursor from s and o
        return this._collection.find(s, o);
    }

    /**
     * Helper to find and fetch
     */
    fetch() {
        return this.find().fetch();
    }

    /**
     * Helper to find and count
     */
    count() {
        return this.find().count();
    }

    /**
     * Helper to find and fetch one
     */
    findOne() {
        return this.find().fetch().shift();
    }
};
