'use strict';

import Model from './lib/Model';
import check from 'powercheck';
import { get } from 'mout/object';
import PartupUpdateModel from './PartupUpdateModel';

export default class ActivityModel extends Model {
    /**
     * Search activity for update
     *
     * @param update {PartupUpdateModel}
     * @returns object
     */
    static searchForPartupUpdate(partupUpdate) {
        check.throw(partupUpdate, PartupUpdateModel);

        return {
            selector: {
                _id: get(partupUpdate.type_data, 'activity_id')
            },
            options: {}
        };
    }
}
