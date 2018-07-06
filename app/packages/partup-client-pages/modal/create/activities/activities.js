import { isString } from 'lodash';

Template.modal_create_activities.onCreated(function() {
  const template = this;
  this.partupId = this.data.partupId || Router.current().params._id;
  if (isString(this.partupId)) {
    this.subscribe('activities.partup_create', this.partupId);
    this.cursor = Activities.find({ partup_id: template.partupId, deleted_at: { $exists: false } }, { sort: { created_at: -1 } });
  }
});

Template.modal_create_activities.helpers({
  partupId() {
    return Template.instance().partupId;
  },
  activities() {
    const { cursor } = Template.instance();
    return (cursor && cursor.fetch()) || [];
  },
  createCallback(activityId) {
    if (!activityId) {
      return;
    }

    const template = Template.instance();
    Meteor.defer(() => {
      const activityEl = template.find(`[data-activity-id=${activityId}]`);
      if (activityEl) {
        activityEl.classList.add('pu-state-highlight');
      }
    });
  },
  showActivityPlaceholder() {
    const { cursor } = Template.instance();
    return cursor && cursor.count() === 0;
  },
  placeholderActivity() {
    return {
        name: TAPi18n.__('pages-modal-create-activities-placeholder-name'),
        description: TAPi18n.__('pages-modal-create-activities-placeholder-description'),
        placeholder: true,
    };
  },
});
