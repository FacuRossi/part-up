import { concat, get, noop } from 'lodash';
import { strings } from 'meteor/partup-client-base';

const isContributing = (activity) => {
  return Contributions.find({ upper_id: Meteor.userId(), activity_id: activity._id, archived: { $ne: true } }).count();
};

const pendingInvite = (activity) => {
  return Invites.findOne({
    invitee_id: Meteor.userId(),
    status: Invites.INVITE_STATUS.PENDING,
    activity_id: activity._id,
  });
}

const contribute = (activity, callback = noop, contribution) => {
  new Promise((resolve, reject) => {
    const isInvited = pendingInvite(activity) != null;

    if (User(Meteor.user()).isPartnerInPartup(activity.partup_id) || isInvited) {
      if (contribution) {
        resolve(contribution);
      } else {
        resolve({});
      }
    } else {
      Partup.client.popup.open({
        id: `popup.motivation.${activity.update_id}`,
      }, (result) => {
        if (get(result, 'success')) {
          resolve({ motivation: result.comment });
        } else {
          reject();
        }
      });
    }
  }).then((contribution) => {
    Meteor.call('contributions.update', activity._id, contribution, function(error, result) {
      try {
        analytics.track('new contribution', {
          partupId: activity.partup_id,
          userId: Meteor.userId(),
          userType: contribution.movivation ? 'supporter' : 'upper',
        });
      } catch (error) {}
      callback(error, result);
    });
  }).catch((error) => error && Partup.client.notify.error(error));
};

Template.ActivityView.onCreated(function() {
  this.partupSlug = get(Partups.findOne(get(this.data.activity, 'partup_id')), 'slug', '');

  this.dropdownToggle = new ReactiveVar(false);
  this.filesToggle = new ReactiveVar(this.data.type === 'detail');

  try {
    if (Router.current().route.getName().match(/partup-documents/)) {
      this.filesToggle.set(true);
    }
  } catch (err) {}
});

Template.ActivityView.helpers({
  contributionCount() {
    return !!Contributions.find({ activity_id: this.activity._id, archived: { $ne: true } }).count();
  },
  contributions() {
    if (this.activity) {
      const cursor = Contributions.find({ activity_id: this.activity._id, archived: { $ne: true } });
      let contributions;

      if (this.type === 'me') {

        const amountToShow = 3;
        contributions = cursor.fetch();

        if (contributions.length > amountToShow) {
          const rest = contributions.length - amountToShow;
          contributions.splice(amountToShow, rest);
          contributions.push({
            rest,
          });
        }
      } else {
        contributions = cursor;
      }

      return contributions;
    }
    return false;
  },
  partupName() {
    return get(Partups.findOne(get(this.activity, 'partup_id')), 'name');
  },
  hasPendingInvite() {
    return pendingInvite(this.activity) != null;
  },
  dropdownData() {
    const self = this;

    // hack to make reactive?
    Template.instance().dropdownToggle.get();

    return {
      activity() {
        return self.activity;
      },
      isCreate() {
        return self.type === 'create';
      },
      isMyActivities() {
        return self.type === 'me';
      },
      isContributing() {
        return isContributing(self.activity);
      },
      isUpper() {
        return User(Meteor.user()).isPartnerInPartup(get(self.activity, 'partup_id'));
      },
      updateIsStarred() {
        const partup = Partups.findOne(get(self.activity, 'partup_id'));
        const updateId = get(self.activity, 'update_id');
        return get(partup, 'starred_updates', []).includes(updateId);
      },
      mayEditActivity() {
        return User(Meteor.user()).isPartnerInPartup(get(self.activity, 'partup_id'));
      },
      activityMayBeStarred() {
        return self.type !== 'me';
      }
    }
  },
  dropdownToggleHandler() {
    return Template.instance().dropdownToggle;
  },
  fileCount() {
    // return 5;
    const { images = [], documents = [] } = get(this.activity, 'files', {});
    return concat(images, documents).length;
  },
  files() {
    return get(this.activity, 'files');
  },
  filesExpanded() {
    return Template.instance().filesToggle.get();
  },
  hasUnreadComments(upper_data = []) {
    return upper_data.filter((upperData) => upperData._id === Meteor.userId() && upperData.new_comments > 0).length > 0;
  },
  isContributing() {
    if (this.activity) {
      return isContributing(this.activity);
    }
    return false;
  },
  lane() {
    return Lanes.findOne(get(this.activity, 'lane_id'));
  },
  partupSlug() {
    return Template.instance().partupSlug;
  },
  popupId() {
    return `popup.motivation.${get(this.activity, 'update_id')}`;
  },
  renderWithMarkdown() {
    return (text) => strings.renderToMarkdownWithEmoji(text);
  },
  truncateDescription() {
    return (text) => strings.truncateHtmlString(
      strings.renderToMarkdownWithEmoji(text),
      55,
    );
  },
  update() {
    return Updates.findOne(get(this.activity, 'update_id'));
  },
  dateClasses() {
    const endDate = get(this.activity, 'end_date');
    const today = moment().startOf('day');

    if (moment(endDate).diff(today) === 0) {
      return 'pu-date--due-today';
    } else if (moment(endDate).diff(today) < 0) {
      return 'pu-date--overdue';
    }
    return undefined;
  },
  // mayInviteOthers() {
  //   return User(Meteor.user()).isPartnerInPartup(get(this.activity, 'partup_id'));
  // }
});

Template.ActivityView.events({
  'click [data-dropdown-open]'(event, template) {
    event.preventDefault();
    template.dropdownToggle.set(true);
  },
  'click [data-contribute]'(event, template) {
    event.preventDefault();
    if (Meteor.user()) {
      contribute(template.data.activity);
    } else {
      Intent.go({ route: 'login' }, () => {
        contribute(template.data.activity);
      });
    }
    template.dropdownToggle.set(false);
  },
  'click [data-invite]'(event, template) {
    event.preventDefault();
    Intent.go({
      route: 'partup-activity-invite',
      params: {
        slug: template.partupSlug,
        activity_id: get(template.data, 'activity._id'),
      },
    });
  },
  'click [data-archive]'(event, template) {
    template.dropdownToggle.set(false);
    Meteor.call('activities.archive', get(template.data.activity, '_id'), (error) => {
      if (error) {
        Partup.client.notify.error(error.reason);
      }
      template.dropdownToggle.set(false);
    });
  },
  'click [data-unarchive]'(event, template) {
    template.dropdownToggle.set(false);
    Meteor.call('activities.unarchive', get(template.data.activity, '_id'), (error) => {
      if (error) {
        Partup.client.notify.error(error.reason);
      }
      template.dropdownToggle.set(false);
    });
  },
  'click [data-star]'(event, template) {
    template.dropdownToggle.set(false);
    Meteor.call('updates.messages.star', get(template.data.activity, 'update_id'), (error) => {
      if (error) {
        if (error.reason === 'partup_message_too_many_stars') {
          Partup.client.notify.error(TAPi18n.__('pur-partup-start-error-too_many_starred_updates'));
        } else {
          Partup.client.notify.error('update-starred-error');
        }
        return;
      }
      Partup.client.notify.success(TAPi18n.__('update-starred-success'));
    });
  },
  'click [data-unstar]'(event, template) {
    template.dropdownToggle.set(false);
    Meteor.call('updates.messages.unstar', get(template.data.activity, 'update_id'), (error) => {
      if (error) {
        Partup.client.notify.error(TAPi18n.__('update-unstarred-error'));
        return;
      }
      Partup.client.notify.success(TAPi18n.__('update-unstarred-success'));
    });
  },
  'click [data-edit]'(event, template) {
    const open = () => {
      Partup.client.popup.open({
        id: `edit-activity-${get(template.data.activity, '_id')}`,
      });
    };
    template.dropdownToggle.set(false);
    if (Meteor.userId()) {
      open();
    } else {
      Intent.go({
        route: 'login',
      }, (user) => {
        if (user) {
          open();
        }
      });
    }
  },
  'click [data-detail]'(event, template) {
    // Which conditions should clicking on comments go to the detail?
    // Which conditions should clicking on files go to the detail?

    if (template.data.type === 'boardview') {
      Router.go('partup-update', {
        slug: template.partupSlug,
        update_id: get(template.data.activity, 'update_id'),
      });
    }
  },
  'click [data-toggle]'(event, template) {
    // Data toggle is specifically for files and should toggle on all views except boardview?
    if (template.data.type !== 'boardview') {
      template.filesToggle.set(!template.filesToggle.curValue);
    }
  },
  'click [data-finalize-contribution]'(event, template) {
    const contribution = Contributions.findOne({
      upper_id: Meteor.userId(),
      activity_id: get(template.data, 'activity._id'),
      finalized: {
        $ne: true
      },
    });

    if (contribution) {
      Meteor.call('contributions.finalize', contribution._id, (error, result) => {
        if (error) {
          Partup.client.notify.error(TAPi18n.__(error));
        } else if (result._id) {
          Partup.client.notify.info(TAPi18n.__('contribution-finalize-success'));
        }
      });
    }
  },
  'click [data-unfinalize-contribution]'(event, template) {
    const contribution = Contributions.findOne({
      upper_id: Meteor.userId(),
      activity_id: get(template.data, 'activity._id'),
      finalized: true,
    });

    if (contribution) {
      Meteor.call('contributions.unfinalize', contribution._id, (error, result) => {
        if (error) {
          Partup.client.notify.error(TAPi18n.__(error));
        } else if (result._id) {
          Partup.client.notify.info(TAPi18n.__('contribution-unfinalize-success'));
        }
      });
    }
  },
});
