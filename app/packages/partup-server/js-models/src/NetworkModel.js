'use strict';

import Model from './lib/Model';
import { getWebsitePathFor } from '../js-helpers/lib/index';
import ImageModel from './ImageModel';

export default class NetworkModel extends Model {

    /**
     * Get network image
     *
     * @return {ImageModel}
     */
    getImage() {
        return ImageModel.findOne({_id: this.image});
    }

    /**
     * Get website url for network
     *
     * @returns {String}
     */
    getWebsiteUrl() {
        const pathname = getWebsitePathFor('network', {slug: this.slug});
        return NetworkModel.settings.makeAbsoluteUrl({pathname});
    }
}
