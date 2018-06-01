import {
    flatMap,
} from 'lodash';

Meteor.methods({

    /**
     * Insert an image by url
     *
     * @param {String} url
     *
     * @return {String} imageId
     */
    'images.insertByUrl'(file) {
        check(file, Partup.schemas.entities.file);
        this.unblock();

        const request = HTTP.get(file.link, { npmRequestOptions: { encoding: null } });
        const fileBody = new Buffer(request.content, 'binary');
        const image = Partup.server.services.images.upload(file.name, fileBody, file.type, {
            id: file._id,
        });
        return {
            _id: image._id,
        };
    },

    // Duplicate because of file-controller.js -> insertFileToCllection.
    'images.insert'(file) {
        check(file, Partup.schemas.entities.file);
        this.unblock();

        const request = HTTP.get(file.link, { npmRequestOptions: { encoding: null } });
        const fileBody = new Buffer(request.content, 'binary');
        const image = Partup.server.services.images.upload(file.name, fileBody, file.type, {
            id: file._id,
        });
        return {
            _id: image._id,
        };
    },
    'images.remove'(id) {
        check(id, String);

        Partup.server.services.images.remove(id);
        Images.remove(id);
        return {
            _id: id,
        };
    },
    'images.remove_many'(ids) {
        check(ids, [String]);

        if (Meteor.user()) {
            _.each(ids, (id) => {
                Partup.server.services.images.remove(id);
                Images.remove(id);
            });
            return {
                _ids: ids,
            };
        }
        throw new Meteor.Error(400, 'unauthorized');
    },
    'images.get'(...ids) {
        ids = flatMap(ids);

        check(ids, [String]);
        this.unblock();

        if (Meteor.user()) {
            const cursor = Images.find({ _id: { $in: ids } });
            return cursor.fetch();
        }
        throw new Meteor.Error(401, 'unauthorized');
    },
});
