import { get, isNumber } from 'lodash';

/**
 * Widget to render a single contribution
 *
 * @module client-contribution
 * @param {Object} contribution         The contribution object to render
 */

Template.Contribution.onCreated(function() {
  this.editing = new ReactiveVar(false);
  this.submitting = new ReactiveVar(false);
});

Template.Contribution.helpers({
  contributor() {
    return Meteor.users.findOne(get(this.contribution, 'upper_id'));
  },
  editing() {
    return Template.instance().editing.get();
  },
  filled() {
    return isNumber(get(this.contribution, 'hours')) || isNumber(get(this.contribution, 'rate'));
  },
  finalized() {
    return get(this.contribution, 'finalized', false);
  },
  formId() {
    return `editContributionForm-${this.contribution._id}`;
  },
  hoursAndRate() {
    return isNumber(this.contribution.hours) && isNumber(this.contribution.rate);
  },
  mayVerify() {
    const partupId = get(this.contribution, 'partup_id', get(this.activity, 'partup_id'));
    return User(Meteor.user()).isPartnerInPartup(partupId) && !get(this.contribution, 'verified');
  },
  isNumber(val) {
    return isNumber(val);
  },
  isOwnContribution() {
    return get(this.contribution, 'upper_id') === Meteor.userId();
  },
  placeholders() {
    return Partup.services.placeholders.contribution;
  },
  schema() {
    return Partup.schemas.forms.contribution;
  },
});

Template.Contribution.events({
  'click [data-close]'(event, template) {
    event.stopPropagation();
    template.editing.set(false);
  },
  'click .pu-contribution-own'(event, template) {
    template.editing.set(true);
  },
  'click [data-remove]'(event, template) {
    Meteor.call('contributions.archive', template.data.contribution._id);
  },
  'click [data-accept]'(event, template) {
    Meteor.call('contributions.accept', template.data.contribution._id, (error) => {
      if (!error) {
        try {
          analytics.track('contribution accepted', {
              contributionId: template.data.contribution._id
          });
        } catch (err) {}
      }
    });
  },
  'click [data-reject]'(event, template) {
    Meteor.call('contributions.reject', template.data.contribution._id, (error) => {
      if (!error) {
        try {
          analytics.track('contribution rejected', {
              contributionId: template.data.contribution._id
          });
        } catch (err) {}
      }
    });
  },
});

AutoForm.addHooks(null, {
  onSubmit: function(doc) {
    if (!/editContributionForm-/.test(this.formId)) return;
    const { data: { activity, contribution }, editing, submitting } = this.template.parent();
    const activityId = get(contribution, 'activity_id', get(activity, '_id'));

    submitting.set(true);
    Meteor.call('contributions.update', activityId, doc, (error) => {
      submitting.set(false);
      editing.set(false);

      if (error) {
        Partup.client.notify.error(TAPi18n.__('contribution-update-error'));
      } else {
        try {
          // TODO: add analytics, currently updating contribs is not being tracked and counts towards new contribs
          // analytics.track('update contribution', {
          //   partupId: activity.partup_id,
          //   userId: Meteor.userId(),
          // });
        } catch (err) {
        }
      }
    });
    return false;
  }
});
