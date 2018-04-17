'use strict';

import Model from './lib/Model';
import { getWebsitePathFor, formatDate } from '../js-helpers/lib/index';
import check from 'powercheck';
import { get } from 'mout/object';
import ImageModel from './ImageModel';

export default class NotificationModel extends Model {

    /**
     * Search for current user
     *
     * @return {Object} search query
     */
    static searchForUser(userId) {
        return {
            selector: {
                for_upper_id: userId,
                grouped: {
                    $exists: false
                }
            },
            options: {
                limit: 20,
                sort: {
                    created_at: -1
                }
            }
        };
    }

    /**
     * Check whether the update has a linked update
     *
     * @returns {Boolean}
     */
    hasUpdate() {
        return !!get(this.type_data, 'update._id');
    }

    /**
     * Get notification image id
     *
     * @return {String}
     */
    getImageId() {
        const notifications = {
            'partups_networks_accepted':                     () => this.type_data.network.image,
            'partups_networks_invited':                      () => this.type_data.inviter.image,
            'partups_networks_upper_left':                   () => this.type_data.upper.image,
            'partups_networks_new_upper':                    () => this.type_data.upper.image,
            'partups_networks_new_pending_upper':            () => this.type_data.pending_upper.image,
            'partup_created_in_network':                     () => this.type_data.creator.image,
            'partup_activities_invited':                     () => this.type_data.inviter.image,
            'partups_archived':                              () => this.type_data.archiver.image,
            'partups_contributions_accepted':                () => this.type_data.accepter.image,
            'contributions_ratings_inserted':                () => this.type_data.rater.image,
            'partups_contributions_rejected':                () => this.type_data.rejecter.image,
            'multiple_comments_in_conversation_since_visit': () => this.type_data.latest_upper.image,
            'partups_multiple_updates_since_visit':          () => this.type_data.latest_upper.image,
            'networks_multiple_new_uppers_since_visit':      () => this.type_data.network.image,
            'partups_activities_inserted':                   () => this.type_data.creator.image,
            'partups_new_comment_in_involved_conversation':  () => this.type_data.commenter.image,
            'partups_contributions_proposed':                () => this.type_data.creator.image,
            'partups_contributions_inserted':                () => this.type_data.creator.image,
            'partups_messages_inserted':                     () => this.type_data.creator.image,
            'partups_ratings_reminder':                      () => 'system',
            'partups_supporters_added':                      () => this.type_data.supporter.image,
            'partups_unarchived':                            () => this.type_data.unarchiver.image,
            'updates_first_comment':                         () => this.type_data.commenter.image,
            'invite_upper_to_partup':                        () => this.type_data.inviter.image,
            'partups_user_mentioned':                        () => this.type_data.mentioning_upper.image,
            'upper_mentioned_in_network_chat':               () => this.type_data.mentioning_upper.image,
            'partups_partner_request':                       () => this.type_data.requester.image,
            'partups_partner_accepted':                      () => this.type_data.accepter.image,
            'partups_partner_rejected':                      () => this.type_data.rejecter.image
        };
        return notifications[this.type] ? notifications[this.type]() : '';
    }

    /**
     * Get notification image
     *
     * @return {ImageModel}
     */
    getImage() {
        if (this.getImageId() === 'system') {
            return new ImageModel({
                getUrl: () => 'images/system-avatar.png'
            });
        }

        return ImageModel.findOne(this.getImageId());
    }

    /**
     * Get notification text replace options for i18next
     *
     * @param {Function} t - i18next's translator function
     */
    getText(t) {
        let key = `notification-${this.type}`;
        const notifications = {
            'partups_networks_accepted':                     () => ({network: this.type_data.network.name}),
            'partups_networks_invited':                      () => ({inviter: this.type_data.inviter.name}),
            'partups_networks_upper_left':                   () => ({upper: this.type_data.upper.name, network: this.type_data.network.name}),
            'partups_networks_new_upper':                    () => ({upper: this.type_data.upper.name, network: this.type_data.network.name}),
            'partups_networks_new_pending_upper':            () => ({network: this.type_data.network.name, pending_upper: this.type_data.pending_upper.name}),
            'partup_created_in_network':                     () => ({partup: this.type_data.partup.name, network: this.type_data.network.name, creator: this.type_data.creator.name}),
            'partup_activities_invited':                     () => ({inviter: this.type_data.inviter.name, activity: this.type_data.activity.name}),
            'partups_archived':                              () => ({partup: this.type_data.partup.name, archiver: this.type_data.archiver.name}),
            'partups_contributions_accepted':                () => ({accepter: this.type_data.accepter.name, activity: this.type_data.activity.name}),
            'contributions_ratings_inserted':                () => ({rater: this.type_data.rater.name}),
            'partups_contributions_rejected':                () => ({rejecter: this.type_data.rejecter.name, activity: this.type_data.activity.name}),
            'multiple_comments_in_conversation_since_visit': () => ({upper: this.type_data.latest_upper.name, others_count: this.type_data.others_count}),
            'partups_multiple_updates_since_visit':          () => ({upper: this.type_data.latest_upper.name, others_count: this.type_data.others_count}),
            'networks_multiple_new_uppers_since_visit':      () => ({upper: this.type_data.latest_upper.name, others_count: this.type_data.others_count, network: this.type_data.network.name}),
            'partups_activities_inserted':                   () => ({creator: this.type_data.creator.name}),
            'partups_new_comment_in_involved_conversation':  () => ({commenter: this.type_data.commenter.name}),
            'partups_contributions_proposed':                () => ({creator: this.type_data.creator.name}),
            'partups_contributions_inserted':                () => ({creator: this.type_data.creator.name}),
            'partups_messages_inserted':                     () => ({creator: this.type_data.creator.name}),
            'partups_ratings_reminder':                      () => ({partup: this.type_data.partup.name}),
            'partups_supporters_added':                      () => ({supporter: this.type_data.supporter.name}),
            'partups_unarchived':                            () => ({partup: this.type_data.partup.name, unarchiver: this.type_data.unarchiver.name}),
            'updates_first_comment':                         () => ({commenter: this.type_data.commenter.name}),
            'invite_upper_to_partup':                        () => ({inviter: this.type_data.inviter.name, partup: this.type_data.partup.name}),
            'partups_user_mentioned':                        () => ({partup: this.type_data.partup.name, mentioning_upper: this.type_data.mentioning_upper.name}),
            'upper_mentioned_in_network_chat':               () => ({network: this.type_data.network.name, mentioning_upper: this.type_data.mentioning_upper.name}),
            'partups_partner_request':                       () => ({partup: this.type_data.partup.name, requester: this.type_data.requester.name}),
            'partups_partner_accepted':                      () => ({partup: this.type_data.partup.name, accepter: this.type_data.accepter.name}),
            'partups_partner_rejected':                      () => ({partup: this.type_data.partup.name, rejecter: this.type_data.rejecter.name})
        };
        let replace = notifications[this.type] ? notifications[this.type]() : {};

        // Exception for partups_multiple_updates_since_visit
        if (this.type === 'partups_multiple_updates_since_visit' &&
            this.type_data.others_count === 0) {
            key = 'notification-partups_multiple_updates_since_visit_single_person';
            replace = {
                upper: this.type_data.latest_upper.name
            };
        }

        return t(key, {replace});
    }

    /**
     * Get meta text for notification (date and possible location)
     *
     * @param {Function} t - i18next's translator function
     */
    getMetaText(t, nowDate) {
        check.throw(t, Function);
        check.throw(nowDate, Date);

        let metaText = [];
        metaText.push(formatDate.relativeWithThreshold(this.created_at, nowDate));

        const notifications = {
            'partups_networks_accepted':                     () => undefined,
            'partups_networks_invited':                      () => this.type_data.network.name,
            'partups_networks_upper_left':                   () => undefined,
            'partups_networks_new_upper':                    () => undefined,
            'partups_networks_new_pending_upper':            () => undefined,
            'partup_created_in_network':                     () => undefined,
            'partup_activities_invited':                     () => this.type_data.partup.name,
            'partups_archived':                              () => undefined,
            'partups_contributions_accepted':                () => this.type_data.partup.name,
            'contributions_ratings_inserted':                () => this.type_data.partup.name,
            'partups_contributions_rejected':                () => this.type_data.partup.name,
            'multiple_comments_in_conversation_since_visit': () => this.type_data.partup.name,
            'partups_multiple_updates_since_visit':          () => this.type_data.partup.name,
            'networks_multiple_new_uppers_since_visit':      () => undefined,
            'partups_activities_inserted':                   () => this.type_data.partup.name,
            'partups_new_comment_in_involved_conversation':  () => this.type_data.partup.name,
            'partups_contributions_proposed':                () => this.type_data.partup.name,
            'partups_contributions_inserted':                () => this.type_data.partup.name,
            'partups_messages_inserted':                     () => this.type_data.partup.name,
            'partups_ratings_reminder':                      () => undefined,
            'partups_supporters_added':                      () => this.type_data.partup.name,
            'partups_unarchived':                            () => undefined,
            'updates_first_comment':                         () => this.type_data.partup.name,
            'invite_upper_to_partup':                        () => this.type_data.partup.name,
            'partups_user_mentioned':                        () => this.type_data.partup.name,
            'upper_mentioned_in_network_chat':               () => this.type_data.network.name,
            'partups_partner_request':                       () => this.type_data.partup.name,
            'partups_partner_accepted':                      () => this.type_data.partup.name,
            'partups_partner_rejected':                      () => this.type_data.partup.name
        };

        const location = notifications[this.type] ? notifications[this.type]() : '';

        const locationString = location && t('notification-location', {location});
        if (location) {
            metaText.push(t('notification-location', {location}));
        }

        return metaText.join(' ');
    }

    /**
     * Get website path for notification
     *
     * @returns {String}
     */
    getWebsiteUrl() {
        const p = getWebsitePathFor;
        const routes = {
            network: () => p('network', {slug: this.type_data.network.slug}),
            networkUppers: () => p('network-uppers', {slug: this.type_data.network.slug}),
            networkSettingsRequests: () => p('network-settings-requests', {slug: this.type_data.network.slug}),
            partup: () => p('partup', {slug: this.type_data.partup.slug}),
            partupUpdate: () => this.type_data.update._id && p('partup-update', {slug: this.type_data.partup.slug, update_id: this.type_data.update._id}),
            partupActivities: () => p('partup-activities', {slug: this.type_data.partup.slug}),
            networkChatMessage: () => p('network-chat-message', {slug: _this5.type_data.network.slug, chat_message_id: _this5.type_data.chat_message._id})
        };

        const notifications = {
            'partups_networks_accepted':                     routes.network,
            'partups_networks_invited':                      routes.network,
            'partups_networks_upper_left':                   routes.network,
            'partups_networks_new_upper':                    routes.networkUppers,
            'partups_networks_new_pending_upper':            routes.networkSettingsRequests,
            'partup_created_in_network':                     routes.partup,
            'partup_activities_invited':                     routes.partupUpdateOrPartupActivities,
            'partups_archived':                              routes.partup,
            'partups_contributions_accepted':                routes.partupUpdate || routes.partup,
            'contributions_ratings_inserted':                routes.partupUpdate || routes.partupActivities,
            'partups_contributions_rejected':                routes.partupUpdate || routes.partup,
            'multiple_comments_in_conversation_since_visit': routes.partupUpdate,
            'partups_multiple_updates_since_visit':          routes.partup,
            'networks_multiple_new_uppers_since_visit':      routes.networkUppers,
            'partups_activities_inserted':                   routes.partupUpdate || routes.partupActivities,
            'partups_new_comment_in_involved_conversation':  routes.partupUpdate,
            'partups_contributions_proposed':                routes.partupUpdate,
            'partups_contributions_inserted':                routes.partupUpdate || routes.partupActivities,
            'partups_messages_inserted':                     routes.partupUpdate || routes.partup,
            'partups_ratings_reminder':                      routes.partupActivities,
            'partups_supporters_added':                      routes.partupUpdate || routes.partup,
            'partups_unarchived':                            routes.partup,
            'updates_first_comment':                         routes.partupUpdate || routes.partup,
            'invite_upper_to_partup':                        routes.partup,
            'partups_user_mentioned':                        routes.partupUpdate,
            'upper_mentioned_in_network_chat':               routes.networkChatMessage,
            'partups_partner_request':                       routes.partupUpdate,
            'partups_partner_accepted':                      routes.partupUpdate,
            'partups_partner_rejected':                      routes.partupUpdate
        };

        const pathname = notifications[this.type] ? notifications[this.type]() : '';

        return NotificationModel.settings.makeAbsoluteUrl({pathname});
    }

}
