var tagsConfiguration = {
    tagClass: 'pu-tag',
    maxTags: 5
};
/**
 * Base Partup schema
 * @name partupBaseSchema
 * @memberOf Partup.schemas
 * @private
 */
var partupBaseSchema = new SimpleSchema({
    description: {
        type: String,
        min: 10,
        max: 250
    },
    expected_result: {
        type: String,
        min: 10,
        max: 250,
    },
    motivation: {
        type: String,
        min: 10,
        max: 250,
        optional: true,
    },
    currency: {
        type: String,
        optional: true,
        allowedValues: [
            'EUR',
            'USD',
            'GBP'
        ],
        autoform: {
            options: [
                {label: 'EUR', value: 'EUR'},
                {label: 'USD', value: 'USD'},
                {label: 'GBP', value: 'GBP'}
            ]
        }
    },
    phase: {
        type: String,
        optional: true,
        allowedValues: [
            Partups.PHASE.BRAINSTORM,
            Partups.PHASE.PLAN,
            Partups.PHASE.EXECUTE,
            Partups.PHASE.GROW
        ]
    },
    type: {
        type: String,
        optional: true,
        allowedValues: [
            Partups.TYPE.CHARITY,
            Partups.TYPE.ENTERPRISING,
            Partups.TYPE.COMMERCIAL,
            Partups.TYPE.ORGANIZATION
        ]
    },
    type_commercial_budget: {
        type: Number,
        min: 0,
        optional: true,
        custom: function() {
            var required = this.field('type').value === Partups.TYPE.COMMERCIAL;
            if (required && !this.isSet) {
                return 'required';
            }
        }
    },
    type_organization_budget: {
        type: Number,
        min: 0,
        optional: true,
        custom: function() {
            var required = this.field('type').value === Partups.TYPE.ORGANIZATION;
            if (required && !this.isSet) {
                return 'required';
            }
        }
    },
    end_date: {
        type: Date,
        min: function() {
            var timezone = new Date().getTimezoneOffset() / 60;
            return new Date(new Date().setHours(-timezone, 0, 0, 0));
        }
    },
    partup_name: {
        type: String,
        max: 60
    },
    image: {
        type: String
    },
    highlighted: {
        type: [Object],
        optional: true,
        maxCount: 4,
    },
    'highlighted.$.id': {
        type: String,
        optional: true,
    },
    'highlighted.$.type': {
        type: String,
    },
    'highlighted.$.thumb': {
        type: String,
        optional: true,
    },
    'highlighted.$.videoType': {
        type: String,
        optional: true,
    },
    'highlighted.$.videoId': {
        type: String,
        optional: true,
    },
    'highlighted.$.url': {
        type: String,
        optional: true,
    },
    network_id: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Id,
        custom: function() {
            if (this.field('privacy_type_input').value === 'network' && !this.isSet) {
                return 'required';
            }
        }
    }
});

/**
 * Partup entity schema
 * @name partup
 * @memberOf Partup.schemas.entities
 */
Partup.schemas.entities.partup = new SimpleSchema([partupBaseSchema, {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    activity_count: {
        type: Number,
        defaultValue: 0
    },
    archived_at: {
        type: Date,
        optional: true
    },
    board_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    created_at: {
        type: Date,
        defaultValue: new Date()
    },
    creator_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    invites: {
        type: [String],
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },
    language: {
        type: String,
        min: 2,
        max: 5
    },
    location: {
        type: Object,
        optional: true
    },
    'location.city': {
        type: String
    },
    'location.country': {
        type: String
    },
    privacy_type: {
        type: Number,
        min: 1,
        max: 9
    },
    shared_count: {
        type: Object
    },
    'shared_count.facebook': {
        type: Number,
        min: 0
    },
    'shared_count.twitter': {
        type: Number,
        min: 0
    },
    'shared_count.linkedin': {
        type: Number,
        min: 0
    },
    'shared_count.email': {
        type: Number,
        min: 0
    },
    start_date: {
        type: Date
    },
    status: {
        type: String
    },
    supporters: {
        type: [String],
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },
    tags: {
        type: [String],
        minCount: 1
    },
    'tags.$': {
        max: 30
    },
    updated_at: {
        type: Date,
        defaultValue: new Date()
    },
    uppers: {
        type: [String],
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },
    upper_data: {
        type: [Object],
        optional: true
    },
    'upper_data.$._id': {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    'upper_data.$.new_updates': {
        type: [String],
        optional: true
    },
    starred_updates: {
        type: [String],
        optional: true,
        regEx: SimpleSchema.RegEx.Id,
        maxCount: 5
    }
}]);

/**
 * start partup form schema
 * @name partupUpdate
 * @memberOf Partup.schemas.forms
 */
Partup.schemas.forms.partup = new SimpleSchema([partupBaseSchema, {
    board_view: {
        type: Boolean
    },
    focuspoint_x_input: {
        type: Number,
        min: 0,
        max: 1,
        decimal: true,
        optional: true
    },
    focuspoint_y_input: {
        type: Number,
        min: 0,
        max: 1,
        decimal: true,
        optional: true
    },
    location_input: {
        type: String,
        max: 255
    },
    tags_input: {
        type: String,
        regEx: Partup.services.validators.tagsSeparatedByComma,
        custom: function() {
            var max = false;
            lodash.each(this.value.split(','), function(tag) {
                if (tag.length > 30) max = true;
            });

            if (max) return 'individualMaxString';
        },
        autoform: {
            type: 'tags',
            afFieldInput: tagsConfiguration
        }
    },
    privacy_type_input: {
        type: String,
        allowedValues: [
            'public',
            'private',
            'network',
            'network_admins',
            'network_colleagues',
            'network_colleagues_custom_a',
            'network_colleagues_custom_b'
        ]
    }
}]);

Partup.schemas.forms.editPartup = new SimpleSchema({
    network_id: {
        type: String,
        optional: true
    }
});
