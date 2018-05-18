'use strict';

import Model from './lib/Model';
import UserModel from './UserModel';
import PartupModel from './PartupModel';
import check from 'powercheck';
import { formatDate } from './helpers';

export default class PartupUpdateModel extends Model {
    static getUserForComment(comment) {
        return new UserModel({
            _id: comment.creator._id,
            profile: {
                name: comment.creator.name,
                image: comment.creator.image
            }
        });
    }

    isActivityRelated() {
        return /^partups_(activities|contributions|ratings)/.test(this.type) ||
            this.type === 'partups_comments_added';
    }

    /**
     * Get part-up
     */
    getPartup() {
        return PartupModel.findOne(this.partup_id);
    }

    /**
     * Get meta text for update (date and partup name)
     *
     * @param {Function} t - i18next's translator function
     * @param {Date} nowDate
     */
    getMetaText(t, nowDate) {
        check.throw(t, Function);
        check.throw(nowDate, Date);

        const partup = this.getPartup();
        check.throw(partup, PartupModel);

        return t('update-metatext', {
            time: formatDate.relativeWithThreshold(this.updated_at, nowDate),
            location: partup.name
        });
    }
}
