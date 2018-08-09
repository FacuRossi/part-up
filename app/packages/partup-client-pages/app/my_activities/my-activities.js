import _ from 'lodash';

Template.myActivities.onCreated(function () {

  this.loading = new ReactiveVar(false);
  this.selector = new ReactiveVar(undefined);
  this.activities = new ReactiveDict({
    thisWeek: [],
    nextWeek: [],
    later: [],
  });

  const activitiesSub = subManager.activities.subscribe('activities.me');

  this.autorun((computation) => {
    this.loading.set(true);

    if (activitiesSub.ready()) {
      computation.stop();
      this.loading.set(false);
    }
  });

  this.autorun(() => {
    if (!activitiesSub.ready()) {
      return;
    }

    const userId = Meteor.userId();

    // Since subscriptions are cached too many activities are shown
    // whenever the user has already navigated to the partup activities page.
    // Therefore a filter needs to be applied here to all published activities.

    const userContributions = Contributions.find({
      upper_id: userId,
    });
    // const invites = Invites.find({
    //   invitee_id: userId,
    // });

    // const activityIds = _.concat(
    //   userContributions.map((c) => c.activity_id),
    //   invites.map((i) => i.activity_id),
    // );

    const activityIds = userContributions.map((c) => c.activity_id);
    const baseSelector = {
      _id: {
        $in: activityIds,
      },
      archived: {
        $ne: true,
      },
      deleted_at: {
        $exists: false,
      }
    }
    const activities = Activities.find({
      ...baseSelector,
    }).fetch();

    const nextWeekStart = moment().startOf('week').add(1, 'week');
    const nextTwoWeekStart = moment().startOf('week').add(2, 'week');

    this.activities.set(
      'thisWeek',
      activities.filter((a) => {
        if (!a.end_date) {
          return false;
        }
        const date = moment(a.end_date);
        return date < nextWeekStart;
      }),
    );

    this.activities.set(
      'nextWeek',
      activities.filter((a) => {
        if (!a.end_date) {
          return false;
        }
        const date = moment(a.end_date);
        return date >= nextWeekStart && date < nextTwoWeekStart;
      }),
    )

    this.activities.set(
      'later',
      activities.filter((a) => {
        if (!a.end_date) {
          return true;
        }
        const date = moment(a.end_date);
        return date >= nextTwoWeekStart;
      }),
    )
  });

});

Template.myActivities.helpers({
  activitiesLoading() {
    return Template.instance().loading.get();
  },
  activityCount(week) {
    const activities = Template.instance().activities;
    switch (week) {
      case 'this':
        return activities.get('thisWeek').length;
      case 'next':
        return activities.get('nextWeek').length;
      case 'later':
        return activities.get('later').length;
      default:
        break;
    }
  },
  hasActivities() {
    const activities = Template.instance().activities;

    return !!(
      activities.get('thisWeek').length + activities.get('nextWeek').length + activities.get('later').length
    );
    // return !!(controller.thisWeekCursor().count() + controller.nextWeekCursor().count() + controller.laterCursor().count());
  },
  thisWeekActivities() {
    return Template.instance().activities.get('thisWeek').sort((a, b) => a.end_date - b.end_date);
  },
  nextWeekActivities() {
    return Template.instance().activities.get('nextWeek').sort((a, b) => a.end_date - b.end_date);
  },
  laterActivities() {
    return _.orderBy(Template.instance().activities.get('later'), [
      (a) => a.end_date,
      (a) => _.get(Partups.findOne(a.partup_id), 'name'),
    ], ['asc', 'asc']);
  },
});
