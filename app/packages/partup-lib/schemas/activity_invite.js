
/**
 * Activity invite entity schema
 * @name activity_invite
 * @memberof Partup.schemas.entities
 */
Partup.schemas.entities.activity_invite = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    type: {
        type: String
    },
    activity_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    inviter_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    invitee_id: {
        optional: true,
        custom: requiredForType('upper')
    },
    invitee_name: {
        optional: true,
        custom: requiredForType('email')
    },
    invitee_email: {
        optional: true,
        custom: requiredForType('email')
    },
    created_at: {
        type: Date,
        defaultValue: new Date()
    },
    status: {
      optional: true,
      custom: requiredForType('upper')
    }
});

/**
 * Helper function that can be used as a custom rule
 * to make a field required for a given type.
 *
 * @param {String} type
 *
 * @return {String}
 */
var requiredForType = function(type) {
    if (this.field('type').value === type) {
        return 'required';
    }
};
