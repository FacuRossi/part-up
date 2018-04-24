'use strict';

import Model from './lib/Model';
import check from 'powercheck';
import { get } from 'mout/object';
import { format as formatUrl } from 'url';
import PartupUpdateModel from './PartupUpdateModel';

export default class ImageModel extends Model {

    /**
     * Get url for image
     *
     * @param {String} store
     */
    getUrl(store) {
        store = store || '1200x520';

        check.throw(ImageModel.settings.awsRegion, String);
        check.throw(ImageModel.settings.awsBucket, String);

        const copy = (this.copies || [])[store];

        return formatUrl({
            protocol: `https`,
            hostname: `s3-${ImageModel.settings.awsRegion}.amazonaws.com`,
            pathname: `/${ImageModel.settings.awsBucket}/${store}/${copy && copy.key}`
        });
    }
}
