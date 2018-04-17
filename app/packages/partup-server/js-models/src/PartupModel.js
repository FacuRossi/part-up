'use strict';

import Model from './lib/Model';
import { getWebsitePathFor } from 'part-up-js-helpers';
import { find } from 'mout/array';
import { get } from 'mout/object';
import ImageModel from './ImageModel';

export default class PartupModel extends Model {

    /**
     * Get partup image
     *
     * @return {ImageModel}
     */
    getImage() {
        return ImageModel.findOne({_id: this.image});
    }

    /**
     * Get website url for partup
     *
     * @returns {String}
     */
    getWebsiteUrl() {
        return PartupModel.settings.makeAbsoluteUrl({
            pathname: getWebsitePathFor('partup', {slug: this.slug})
        });
    }

    /**
     * Get new updates count
     *
     * @returns {Number}
     */
    getNewUpdatesCount(userId) {
        if (!this.upper_data) {
            return 0;
        }

        const upperData = find(this.upper_data, (d) => d._id === userId) || {};
        return get(upperData, 'new_updates.length') || 0;
    }
}
