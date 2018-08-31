import { get } from 'lodash';

// For the collection events documentation, see [https://github.com/matb33/meteor-collection-hooks].
var equal = Npm.require('deeper');

/**
 * Generate a basic after insert handler.
 *
 * @param {String} namespace
 * @return {function}
 * @ignore
 */
var basicAfterInsert = function(namespace) {
    return function(userId, document) {

        // If no userId is present, try getting it from the document
        // Used for User-API access, as no user is specified
        if (!userId) {
            userId = document.creator_id ||
                     document.upper_id ||
                     get(document, 'type_data.creator._id')
        }

        Event.emit(namespace + '.inserted', userId, document);
    };
};

/**
 * Generate a basic after update handler.
 *
 * @param {String} namespace
 *
 * @return {function}
 * @ignore
 */
var basicAfterUpdate = function(namespace) {
    return function(userId, document, fieldNames, modifier, options) {

        // If no userId is present, try getting it from the document
        // Used for User-API access, as no user is specified
        if (!userId) {
            userId = document.creator_id ||
                     document.upper_id ||
                     get(document, 'type_data.creator._id')
        }

        Event.emit(namespace + '.updated', userId, document, this.previous);

        if (this.previous) {
            var previous = this.previous;

            fieldNames.forEach(function(key) {
                var value = {
                    'name': key,
                    'old': previous[key],
                    'new': document[key]
                };

                if (equal(value.old, value.new)) return;

                Event.emit(namespace + '.' + key + '.changed', userId, document, value);
            });
        }
    };
};

/**
 * Generate a basic after remove handler.
 *
 * @param {String} namespace
 *
 * @return {function}
 * @ignore
 */
var basicAfterRemove = function(namespace) {
    return function(userId, document) {
        Event.emit(namespace + '.removed', userId, document);
    };
};

// Partup Events
Partups.after.insert(basicAfterInsert('partups'));
Partups.after.update(basicAfterUpdate('partups'));
Partups.after.remove(basicAfterRemove('partups'));

// Networks Events
Networks.after.insert(basicAfterInsert('networks'));
Networks.after.update(basicAfterUpdate('networks'));
Networks.after.remove(basicAfterRemove('networks'));

// Activity Events
Activities.after.insert(basicAfterInsert('partups.activities'));
Activities.after.update(basicAfterUpdate('partups.activities'));
Activities.after.remove(basicAfterRemove('partups.activities'));

// Update Events
Updates.hookOptions.after.update = {fetchPrevious: false};
Updates.after.insert(basicAfterInsert('partups.updates'));
Updates.after.update(basicAfterUpdate('partups.updates'));
Updates.after.remove(basicAfterRemove('partups.updates'));

// Contribution Events
Contributions.after.insert(basicAfterInsert('partups.contributions'));
Contributions.after.update(basicAfterUpdate('partups.contributions'));
Contributions.after.remove(basicAfterRemove('partups.contributions'));

// Ratings Events
Ratings.after.insert(basicAfterInsert('partups.contributions.ratings'));
Ratings.after.update(basicAfterUpdate('partups.contributions.ratings'));
Ratings.after.remove(basicAfterRemove('partups.contributions.ratings'));

// Notifications Events
Notifications.after.insert(basicAfterInsert('partups.notifications'));

ImpersonationRequests.before.insert((userId, doc) => {
  doc.created_at = new Date();
});
