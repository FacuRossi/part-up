var equal = Npm.require('equals');
var events = Npm.require('eventemitter2');

/**
 * The global event emitter instance.
 *
 * @type {EventEmitter2}
 */
Event = new events.EventEmitter2({
    wildcard: true,
    delimiter: '.'
});

/**
 * Helper to handle the event emitting for an insertion of a collection document.
 *
 * @param collection (Mongo.Collection)
 * @param fields
 */
Event.emitCollectionInsert = function (collection, fields) {
    Event.emit('collections.' + collection._name + '.insert', fields);
};

/**
 * Helper to handle the event emitting for an update of a collection document.
 *
 * @param collection (Mongo.Collection)
 * @param document
 * @param fields
 */
Event.emitCollectionUpdate = function (collection, document, fields) {
    if (equal(document, fields)) return;

    Event.emit('collections.' + collection._name + '.update', document._id, fields);

    Object.keys(fields).forEach(function (key) {
        var value = {
            'name': key,
            'old': document[key],
            'new': fields[key]
        };

        if (equal(value.old, value.new)) return;

        Event.emit('collections.' + collection._name + '.' + key + '.update', document._id, value);
    });
};

/**
 * Helper to handle the event emitting for a removal in a collection document.
 *
 * @param collection
 * @param document
 */
Event.emitCollectionRemove = function (collection, document) {
    Event.emit('collections.' + collection._name + '.remove', document._id);
};