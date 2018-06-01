var d = Debug('services:profile_completeness');

/**
 @namespace Partup server profile_completeness service
 @name Partup.server.services.profile_completeness
 @memberof Partup.server.services
 */
Partup.server.services.profile_completeness = {
    /**
     * Update new profile completeness percentage
     *
     * @param {Object} user
     */
    updateScore: function(user) {
        user = user || Meteor.user();

        var allFields = [
            'name',
            'image',
            'description',
            'tags',
            'location',
            'facebook_url',
            'twitter_url',
            'instagram_url',
            'linkedin_url',
            'phonenumber',
            'website',
            'skype',
            'tiles',
        ];
        var providedValues = 0;

        _.each(user.profile, function(value, key) {
            // Don't count empty values
            if (!value || value.length < 1) return;

            // Neglect fields that are not important to this score
            if (allFields.indexOf(key) < 0) return;

            // Handle the special cases
            if (key === 'location' && !value.city) return;

            // Valid stuff, add to score count
            providedValues++;
        });

        // Calculate new percentage
        var completeness = Math.round((providedValues * 100) / allFields.length);

        // And update if valid
        if (typeof completeness == 'number') {
            Meteor.users.update(user._id, {$set: {completeness: completeness}});
        }
    }
};
