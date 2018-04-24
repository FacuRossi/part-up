'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Model2 = require('./lib/Model');

var _Model3 = _interopRequireDefault(_Model2);

var _index = require('../js-helpers/lib/index');

var _powercheck = require('powercheck');

var _powercheck2 = _interopRequireDefault(_powercheck);

var _object = require('mout/object');

var _ImageModel = require('./ImageModel');

var _ImageModel2 = _interopRequireDefault(_ImageModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotificationModel = function (_Model) {
    _inherits(NotificationModel, _Model);

    function NotificationModel() {
        _classCallCheck(this, NotificationModel);

        return _possibleConstructorReturn(this, (NotificationModel.__proto__ || Object.getPrototypeOf(NotificationModel)).apply(this, arguments));
    }

    _createClass(NotificationModel, [{
        key: 'hasUpdate',


        /**
         * Check whether the update has a linked update
         *
         * @returns {Boolean}
         */
        value: function hasUpdate() {
            return !!(0, _object.get)(this.type_data, 'update._id');
        }

        /**
         * Get notification image id
         *
         * @return {String}
         */

    }, {
        key: 'getImageId',
        value: function getImageId() {
            var _this2 = this;

            var notifications = {
                'partups_networks_accepted': function partups_networks_accepted() {
                    return _this2.type_data.network.image;
                },
                'partups_networks_invited': function partups_networks_invited() {
                    return _this2.type_data.inviter.image;
                },
                'partups_networks_upper_left': function partups_networks_upper_left() {
                    return _this2.type_data.upper.image;
                },
                'partups_networks_new_upper': function partups_networks_new_upper() {
                    return _this2.type_data.upper.image;
                },
                'partups_networks_new_pending_upper': function partups_networks_new_pending_upper() {
                    return _this2.type_data.pending_upper.image;
                },
                'partup_created_in_network': function partup_created_in_network() {
                    return _this2.type_data.creator.image;
                },
                'partup_activities_invited': function partup_activities_invited() {
                    return _this2.type_data.inviter.image;
                },
                'partups_archived': function partups_archived() {
                    return _this2.type_data.archiver.image;
                },
                'partups_contributions_accepted': function partups_contributions_accepted() {
                    return _this2.type_data.accepter.image;
                },
                'contributions_ratings_inserted': function contributions_ratings_inserted() {
                    return _this2.type_data.rater.image;
                },
                'partups_contributions_rejected': function partups_contributions_rejected() {
                    return _this2.type_data.rejecter.image;
                },
                'multiple_comments_in_conversation_since_visit': function multiple_comments_in_conversation_since_visit() {
                    return _this2.type_data.latest_upper.image;
                },
                'partups_multiple_updates_since_visit': function partups_multiple_updates_since_visit() {
                    return _this2.type_data.latest_upper.image;
                },
                'networks_multiple_new_uppers_since_visit': function networks_multiple_new_uppers_since_visit() {
                    return _this2.type_data.network.image;
                },
                'partups_activities_inserted': function partups_activities_inserted() {
                    return _this2.type_data.creator.image;
                },
                'partups_new_comment_in_involved_conversation': function partups_new_comment_in_involved_conversation() {
                    return _this2.type_data.commenter.image;
                },
                'partups_contributions_proposed': function partups_contributions_proposed() {
                    return _this2.type_data.creator.image;
                },
                'partups_contributions_inserted': function partups_contributions_inserted() {
                    return _this2.type_data.creator.image;
                },
                'partups_messages_inserted': function partups_messages_inserted() {
                    return _this2.type_data.creator.image;
                },
                'partups_ratings_reminder': function partups_ratings_reminder() {
                    return 'system';
                },
                'partups_supporters_added': function partups_supporters_added() {
                    return _this2.type_data.supporter.image;
                },
                'partups_unarchived': function partups_unarchived() {
                    return _this2.type_data.unarchiver.image;
                },
                'updates_first_comment': function updates_first_comment() {
                    return _this2.type_data.commenter.image;
                },
                'invite_upper_to_partup': function invite_upper_to_partup() {
                    return _this2.type_data.inviter.image;
                },
                'partups_user_mentioned': function partups_user_mentioned() {
                    return _this2.type_data.mentioning_upper.image;
                },
                'upper_mentioned_in_network_chat': function upper_mentioned_in_network_chat() {
                    return _this2.type_data.mentioning_upper.image;
                },
                'partups_partner_request': function partups_partner_request() {
                    return _this2.type_data.requester.image;
                },
                'partups_partner_accepted': function partups_partner_accepted() {
                    return _this2.type_data.accepter.image;
                },
                'partups_partner_rejected': function partups_partner_rejected() {
                    return _this2.type_data.rejecter.image;
                }
            };
            return notifications[this.type] ? notifications[this.type]() : '';
        }

        /**
         * Get notification image
         *
         * @return {ImageModel}
         */

    }, {
        key: 'getImage',
        value: function getImage() {
            if (this.getImageId() === 'system') {
                return new _ImageModel2.default({
                    getUrl: function getUrl() {
                        return 'images/system-avatar.png';
                    }
                });
            }

            return _ImageModel2.default.findOne(this.getImageId());
        }

        /**
         * Get notification text replace options for i18next
         *
         * @param {Function} t - i18next's translator function
         */

    }, {
        key: 'getText',
        value: function getText(t) {
            var _this3 = this;

            var key = 'notification-' + this.type;
            var notifications = {
                'partups_networks_accepted': function partups_networks_accepted() {
                    return { network: _this3.type_data.network.name };
                },
                'partups_networks_invited': function partups_networks_invited() {
                    return { inviter: _this3.type_data.inviter.name };
                },
                'partups_networks_upper_left': function partups_networks_upper_left() {
                    return { upper: _this3.type_data.upper.name, network: _this3.type_data.network.name };
                },
                'partups_networks_new_upper': function partups_networks_new_upper() {
                    return { upper: _this3.type_data.upper.name, network: _this3.type_data.network.name };
                },
                'partups_networks_new_pending_upper': function partups_networks_new_pending_upper() {
                    return { network: _this3.type_data.network.name, pending_upper: _this3.type_data.pending_upper.name };
                },
                'partup_created_in_network': function partup_created_in_network() {
                    return { partup: _this3.type_data.partup.name, network: _this3.type_data.network.name, creator: _this3.type_data.creator.name };
                },
                'partup_activities_invited': function partup_activities_invited() {
                    return { inviter: _this3.type_data.inviter.name, activity: _this3.type_data.activity.name };
                },
                'partups_archived': function partups_archived() {
                    return { partup: _this3.type_data.partup.name, archiver: _this3.type_data.archiver.name };
                },
                'partups_contributions_accepted': function partups_contributions_accepted() {
                    return { accepter: _this3.type_data.accepter.name, activity: _this3.type_data.activity.name };
                },
                'contributions_ratings_inserted': function contributions_ratings_inserted() {
                    return { rater: _this3.type_data.rater.name };
                },
                'partups_contributions_rejected': function partups_contributions_rejected() {
                    return { rejecter: _this3.type_data.rejecter.name, activity: _this3.type_data.activity.name };
                },
                'multiple_comments_in_conversation_since_visit': function multiple_comments_in_conversation_since_visit() {
                    return { upper: _this3.type_data.latest_upper.name, others_count: _this3.type_data.others_count };
                },
                'partups_multiple_updates_since_visit': function partups_multiple_updates_since_visit() {
                    return { upper: _this3.type_data.latest_upper.name, others_count: _this3.type_data.others_count };
                },
                'networks_multiple_new_uppers_since_visit': function networks_multiple_new_uppers_since_visit() {
                    return { upper: _this3.type_data.latest_upper.name, others_count: _this3.type_data.others_count, network: _this3.type_data.network.name };
                },
                'partups_activities_inserted': function partups_activities_inserted() {
                    return { creator: _this3.type_data.creator.name };
                },
                'partups_new_comment_in_involved_conversation': function partups_new_comment_in_involved_conversation() {
                    return { commenter: _this3.type_data.commenter.name };
                },
                'partups_contributions_proposed': function partups_contributions_proposed() {
                    return { creator: _this3.type_data.creator.name };
                },
                'partups_contributions_inserted': function partups_contributions_inserted() {
                    return { creator: _this3.type_data.creator.name };
                },
                'partups_messages_inserted': function partups_messages_inserted() {
                    return { creator: _this3.type_data.creator.name };
                },
                'partups_ratings_reminder': function partups_ratings_reminder() {
                    return { partup: _this3.type_data.partup.name };
                },
                'partups_supporters_added': function partups_supporters_added() {
                    return { supporter: _this3.type_data.supporter.name };
                },
                'partups_unarchived': function partups_unarchived() {
                    return { partup: _this3.type_data.partup.name, unarchiver: _this3.type_data.unarchiver.name };
                },
                'updates_first_comment': function updates_first_comment() {
                    return { commenter: _this3.type_data.commenter.name };
                },
                'invite_upper_to_partup': function invite_upper_to_partup() {
                    return { inviter: _this3.type_data.inviter.name, partup: _this3.type_data.partup.name };
                },
                'partups_user_mentioned': function partups_user_mentioned() {
                    return { partup: _this3.type_data.partup.name, mentioning_upper: _this3.type_data.mentioning_upper.name };
                },
                'upper_mentioned_in_network_chat': function upper_mentioned_in_network_chat() {
                    return { network: _this3.type_data.network.name, mentioning_upper: _this3.type_data.mentioning_upper.name };
                },
                'partups_partner_request': function partups_partner_request() {
                    return { partup: _this3.type_data.partup.name, requester: _this3.type_data.requester.name };
                },
                'partups_partner_accepted': function partups_partner_accepted() {
                    return { partup: _this3.type_data.partup.name, accepter: _this3.type_data.accepter.name };
                },
                'partups_partner_rejected': function partups_partner_rejected() {
                    return { partup: _this3.type_data.partup.name, rejecter: _this3.type_data.rejecter.name };
                }
            };
            var replace = notifications[this.type] ? notifications[this.type]() : {};

            // Exception for partups_multiple_updates_since_visit
            if (this.type === 'partups_multiple_updates_since_visit' && this.type_data.others_count === 0) {
                key = 'notification-partups_multiple_updates_since_visit_single_person';
                replace = {
                    upper: this.type_data.latest_upper.name
                };
            }

            return t(key, { replace: replace });
        }

        /**
         * Get meta text for notification (date and possible location)
         *
         * @param {Function} t - i18next's translator function
         */

    }, {
        key: 'getMetaText',
        value: function getMetaText(t, nowDate) {
            var _this4 = this;

            _powercheck2.default.throw(t, Function);
            _powercheck2.default.throw(nowDate, Date);

            var metaText = [];
            metaText.push(_index.formatDate.relativeWithThreshold(this.created_at, nowDate));

            var notifications = {
                'partups_networks_accepted': function partups_networks_accepted() {
                    return undefined;
                },
                'partups_networks_invited': function partups_networks_invited() {
                    return _this4.type_data.network.name;
                },
                'partups_networks_upper_left': function partups_networks_upper_left() {
                    return undefined;
                },
                'partups_networks_new_upper': function partups_networks_new_upper() {
                    return undefined;
                },
                'partups_networks_new_pending_upper': function partups_networks_new_pending_upper() {
                    return undefined;
                },
                'partup_created_in_network': function partup_created_in_network() {
                    return undefined;
                },
                'partup_activities_invited': function partup_activities_invited() {
                    return _this4.type_data.partup.name;
                },
                'partups_archived': function partups_archived() {
                    return undefined;
                },
                'partups_contributions_accepted': function partups_contributions_accepted() {
                    return _this4.type_data.partup.name;
                },
                'contributions_ratings_inserted': function contributions_ratings_inserted() {
                    return _this4.type_data.partup.name;
                },
                'partups_contributions_rejected': function partups_contributions_rejected() {
                    return _this4.type_data.partup.name;
                },
                'multiple_comments_in_conversation_since_visit': function multiple_comments_in_conversation_since_visit() {
                    return _this4.type_data.partup.name;
                },
                'partups_multiple_updates_since_visit': function partups_multiple_updates_since_visit() {
                    return _this4.type_data.partup.name;
                },
                'networks_multiple_new_uppers_since_visit': function networks_multiple_new_uppers_since_visit() {
                    return undefined;
                },
                'partups_activities_inserted': function partups_activities_inserted() {
                    return _this4.type_data.partup.name;
                },
                'partups_new_comment_in_involved_conversation': function partups_new_comment_in_involved_conversation() {
                    return _this4.type_data.partup.name;
                },
                'partups_contributions_proposed': function partups_contributions_proposed() {
                    return _this4.type_data.partup.name;
                },
                'partups_contributions_inserted': function partups_contributions_inserted() {
                    return _this4.type_data.partup.name;
                },
                'partups_messages_inserted': function partups_messages_inserted() {
                    return _this4.type_data.partup.name;
                },
                'partups_ratings_reminder': function partups_ratings_reminder() {
                    return undefined;
                },
                'partups_supporters_added': function partups_supporters_added() {
                    return _this4.type_data.partup.name;
                },
                'partups_unarchived': function partups_unarchived() {
                    return undefined;
                },
                'updates_first_comment': function updates_first_comment() {
                    return _this4.type_data.partup.name;
                },
                'invite_upper_to_partup': function invite_upper_to_partup() {
                    return _this4.type_data.partup.name;
                },
                'partups_user_mentioned': function partups_user_mentioned() {
                    return _this4.type_data.partup.name;
                },
                'upper_mentioned_in_network_chat': function upper_mentioned_in_network_chat() {
                    return _this4.type_data.network.name;
                },
                'partups_partner_request': function partups_partner_request() {
                    return _this4.type_data.partup.name;
                },
                'partups_partner_accepted': function partups_partner_accepted() {
                    return _this4.type_data.partup.name;
                },
                'partups_partner_rejected': function partups_partner_rejected() {
                    return _this4.type_data.partup.name;
                }
            };

            var location = notifications[this.type] ? notifications[this.type]() : '';

            var locationString = location && t('notification-location', { location: location });
            if (location) {
                metaText.push(t('notification-location', { location: location }));
            }

            return metaText.join(' ');
        }

        /**
         * Get website path for notification
         *
         * @returns {String}
         */

    }, {
        key: 'getWebsiteUrl',
        value: function getWebsiteUrl() {
            var _this6 = this;

            var p = _index.getWebsitePathFor;
            var routes = {
                network: function network() {
                    return p('network', { slug: _this6.type_data.network.slug });
                },
                networkUppers: function networkUppers() {
                    return p('network-uppers', { slug: _this6.type_data.network.slug });
                },
                networkSettingsRequests: function networkSettingsRequests() {
                    return p('network-settings-requests', { slug: _this6.type_data.network.slug });
                },
                partup: function partup() {
                    return p('partup', { slug: _this6.type_data.partup.slug });
                },
                partupUpdate: function partupUpdate() {
                    return _this6.type_data.update._id && p('partup-update', { slug: _this6.type_data.partup.slug, update_id: _this6.type_data.update._id });
                },
                partupActivities: function partupActivities() {
                    return p('partup-activities', { slug: _this6.type_data.partup.slug });
                },
                networkChatMessage: function networkChatMessage() {
                    return p('network-chat-message', { slug: _this5.type_data.network.slug, chat_message_id: _this5.type_data.chat_message._id });
                }
            };

            var notifications = {
                'partups_networks_accepted': routes.network,
                'partups_networks_invited': routes.network,
                'partups_networks_upper_left': routes.network,
                'partups_networks_new_upper': routes.networkUppers,
                'partups_networks_new_pending_upper': routes.networkSettingsRequests,
                'partup_created_in_network': routes.partup,
                'partup_activities_invited': routes.partupUpdateOrPartupActivities,
                'partups_archived': routes.partup,
                'partups_contributions_accepted': routes.partupUpdate || routes.partup,
                'contributions_ratings_inserted': routes.partupUpdate || routes.partupActivities,
                'partups_contributions_rejected': routes.partupUpdate || routes.partup,
                'multiple_comments_in_conversation_since_visit': routes.partupUpdate,
                'partups_multiple_updates_since_visit': routes.partup,
                'networks_multiple_new_uppers_since_visit': routes.networkUppers,
                'partups_activities_inserted': routes.partupUpdate || routes.partupActivities,
                'partups_new_comment_in_involved_conversation': routes.partupUpdate,
                'partups_contributions_proposed': routes.partupUpdate,
                'partups_contributions_inserted': routes.partupUpdate || routes.partupActivities,
                'partups_messages_inserted': routes.partupUpdate || routes.partup,
                'partups_ratings_reminder': routes.partupActivities,
                'partups_supporters_added': routes.partupUpdate || routes.partup,
                'partups_unarchived': routes.partup,
                'updates_first_comment': routes.partupUpdate || routes.partup,
                'invite_upper_to_partup': routes.partup,
                'partups_user_mentioned': routes.partupUpdate,
                'upper_mentioned_in_network_chat': routes.networkChatMessage,
                'partups_partner_request': routes.partupUpdate,
                'partups_partner_accepted': routes.partupUpdate,
                'partups_partner_rejected': routes.partupUpdate
            };

            var pathname = notifications[this.type] ? notifications[this.type]() : '';

            return NotificationModel.settings.makeAbsoluteUrl({ pathname: pathname });
        }
    }], [{
        key: 'searchForUser',


        /**
         * Search for current user
         *
         * @return {Object} search query
         */
        value: function searchForUser(userId) {
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
    }]);

    return NotificationModel;
}(_Model3.default);

exports.default = NotificationModel;
module.exports = exports['default'];