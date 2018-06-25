var gm = Npm.require('gm').subClass({ imageMagick: true });
var path = Npm.require('path');
import _ from 'lodash';

/**
 @namespace Partup server images service
 @name Partup.server.services.images
 @memberof Partup.server.services
 */
Partup.server.services.images = {

    /**
     * Upload (and resize) an image
     *
     * @param {String} filename
     * @param {String} body
     * @param {String} mimetype
     * @param {Object} options
     * @param {String} options._id
     * @param {Object} options.meta
     */
    upload: function(filename, body, mimetype, options) {
        var options = options || {};
        var meta = options.meta || {};
        var id = options.id || Random.id();

        var extension = path.extname(filename);
        var filename = id + extension;

        var image = {
            _id: id,
            name: filename,
            type: mimetype,
            copies: {},
            createdAt: new Date(),
            meta: meta
        };

        var filekey = id + '-' + filename;

        // TODO (extra): Add .autoOrient() to gm calls

        S3.putObjectSync({ Key: 'images/' + filekey, Body: body, ContentType: mimetype });
        image.copies['original'] = { key: 'images/' + filekey, size: body.length };

        var sizes = [{ w: 32, h: 32 }, { w: 80, h: 80 }, { w: 360, h: 360 }, { w: 1200, h: 520 }];

        var resize = function(filename, body, width, height, callback) {
            gm(body, filename).resize(width, height).toBuffer(function(error, resizedBody) {
                if (error) return callback(error);
                return callback(null, resizedBody);
            });
        };

        var resizeSync = Meteor.wrapAsync(resize);

        sizes.forEach(function(size) {
            var directory = size.w + 'x' + size.h;
            var resizedBody = resizeSync(filename, body, size.w, size.h);
            image.copies[directory] = { key: 'images/' + filekey, size: resizedBody.length };
            S3.putObjectSync({ Key: directory + '/images/' + filekey, Body: resizedBody, ContentType: mimetype });
        });

        Images.insert(image);

        return image;
    },

    remove(id) {
        const image = Images.findOne(id);

        if (image && image.copies) {
            const s3Key = `${image._id}-${image.name}`;
            _.each(Object.keys(image.copies), (key) => {
                if (key === 'original') {
                    S3.deleteObjectSync({ Key: `images/${s3Key}` });
                } else {
                    S3.deleteObjectSync({ Key: `${key}/images/${s3Key}` });
                }
            });

            return {
                _id: id,
            };
        }
        
        if (image && images.copies) {
            throw new Meteor.Error(0, `images:remove could not find image with _id: ${id} or the image has no copies: ${image.copies}`);    
        } else {
            throw new Meteor.Error(0, `images:remove could not find image with _id: ${id}`);
        }
        
    },

    /**
     * Store a focuspoint in an image
     *
     * @param {string} imageId
     * @param {number} focuspoint_x
     * @param {number} focuspoint_y
     */
    storeFocuspoint: function(imageId, focuspoint_x, focuspoint_y) {

        if (!imageId) throw new Error('Required argument [imageId] is missing for method [Partup.server.services.images::storeFocuspoint]');
        if (!mout.lang.isNumber(focuspoint_x)) throw new Error('Required argument [focuspoint_x] is not a number for method [Partup.server.services.images::storeFocuspoint]');
        if (!mout.lang.isNumber(focuspoint_y)) throw new Error('Required argument [focuspoint_y] is not a number for method [Partup.server.services.images::storeFocuspoint]');
        if (focuspoint_x < 0 || focuspoint_x > 1) throw new Error('Argument [focuspoint_x] is not a number between 0 and 1 for method [Partup.server.services.images::storeFocuspoint]');
        if (focuspoint_y < 0 || focuspoint_y > 1) throw new Error('Argument [focuspoint_y] is not a number between 0 and 1 for method [Partup.server.services.images::storeFocuspoint]');

        var image = Images.findOne(imageId);
        if (!image) throw new Error('Could not find an image by [imageId] for method [Partup.server.services.images::storeFocuspoint]');

        var focuspoint = {
            x: focuspoint_x,
            y: focuspoint_y
        };

        Images.update(imageId, { $set: { focuspoint: focuspoint } });

    }

};