'use strict';

import { isString } from 'mout/lang';
import { extend } from 'lodash';
import QueryBuilder from './QueryBuilder';

export default class LinkMeteorCollection {
    constructor(Mongo, connection) {
        this.Mongo = Mongo;
        this.connection = connection;
    }

    link(Model, collection) {
        if (typeof collection !== 'string' && !(collection instanceof this.Mongo.Collection)) {
            throw new Error('collection must be a string or an instance of Mongo.Collection');
        }

        let c = collection;

        // Create Mongo collection
        if (isString(collection)) {
            c = new this.Mongo.Collection(c, {
                connection: this.connection
            });
        }

        // Transform document to extend opts.Document
        c._transform = (doc) => new Model(doc);

        // Define query builder
        c.query = () => new QueryBuilder(Model);

        // Extend model with the collection
        extend(Model, c);
    }
}
