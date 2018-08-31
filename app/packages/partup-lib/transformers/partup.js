/**
 * Partup transformer service
 * @name partup.transformers.partup
 * @memberOf Partup.transformers
 */
Partup.transformers.partup = {
    /**
     * Transform partup to start partup form
     *
     * @memberOf Partup.transformers.partup
     * @param {Object} partup
     */
    'toFormStartPartup': function(partup) {
        // Find image for focuspoint
        var image = Images.findOne({_id: partup.image});

        var fields = {
            partup_name: partup.name,
            _id: partup._id,
            description: partup.description,
            expected_result: partup.expected_result,
            highlighted: partup.highlighted,
            type: partup.type || Partups.TYPE.CHARITY,
            type_commercial_budget: partup.type_commercial_budget,
            type_organization_budget: partup.type_organization_budget,
            currency: partup.currency,
            end_date: partup.end_date,
            location_input: Partup.services.location.locationToLocationInput(partup.location),
            name: partup.name,
            tags_input: Partup.services.tags.tagArrayToInput(partup.tags),
            focuspoint_x_input: image ? (mout.object.get(image, 'focuspoint.x') || 0) : 0,
            focuspoint_y_input: image ? (mout.object.get(image, 'focuspoint.y') || 0) : 0,
            phase: partup.phase,
            board_view: partup.board_view
        };

        if (partup.motivation) {
            fields.motivation = partup.motivation;
        }

        // Determine privacy type
        if (partup.privacy_type === Partups.privacy_types.PUBLIC) {
            fields.privacy_type_input = 'public';
        } else if (partup.privacy_type === Partups.privacy_types.PRIVATE) {
            fields.privacy_type_input = 'private';
        } else if (partup.privacy_type === Partups.privacy_types.NETWORK_ADMINS) {
            fields.privacy_type_input = 'network_admins';
        } else if (partup.privacy_type === Partups.privacy_types.NETWORK_COLLEAGUES) {
            fields.privacy_type_input = 'network_colleagues';
        } else if (partup.privacy_type === Partups.privacy_types.NETWORK_COLLEAGUES_CUSTOM_A) {
            fields.privacy_type_input = 'network_colleagues_custom_a';
        } else if (partup.privacy_type === Partups.privacy_types.NETWORK_COLLEAGUES_CUSTOM_B) {
            fields.privacy_type_input = 'network_colleagues_custom_b';
        } else if (partup.privacy_type === Partups.privacy_types.NETWORK_PUBLIC ||
            partup.privacy_type === Partups.privacy_types.NETWORK_INVITE ||
            partup.privacy_type === Partups.privacy_types.NETWORK_CLOSED) {
            fields.privacy_type_input = partup.network_id;
        }

        return fields;
    },

    /**
     * Transform startpartup form to partup
     *
     * @memberOf Partup.transformers.partup
     * @param {mixed[]} fields
     */
    'fromFormStartPartup': function(fields) {
        var partup = {
            // form fields
            name: fields.partup_name,
            description: fields.description,
            expected_result: fields.expected_result,
            highlighted: fields.highlighted,
            type: fields.type || Partups.TYPE.CHARITY,
            type_commercial_budget: fields.type_commercial_budget,
            type_organization_budget: fields.type_organization_budget,
            currency: fields.currency,
            end_date: fields.end_date,
            image: fields.image,
            tags: Partup.services.tags.tagInputToArray(fields.tags_input),
            language: Partup.server.services.google.detectLanguage(fields.description),
            phase: fields.phase,
            board_view: fields.board_view
        };

        if (fields.motivation) {
            partup.motivation = fields.motivation;
        }

        var newLocation = Partup.services.location.locationInputToLocation(fields.location_input);
        if (newLocation) partup.location = newLocation;

        // Set network ID if needed
        if (fields.privacy_type_input === 'network' ||
            fields.privacy_type_input === 'network_admins' ||
            fields.privacy_type_input === 'network_colleagues' ||
            fields.privacy_type_input === 'network_colleagues_custom_a' ||
            fields.privacy_type_input === 'network_colleagues_custom_b') {
            var network = Networks.findOneOrFail(fields.network_id);
            partup.network_id = network._id;
        }

        // Determine privacy type
        if (fields.privacy_type_input === 'public') {
            partup.privacy_type = Partups.privacy_types.PUBLIC;
        } else if (fields.privacy_type_input === 'private') {
            partup.privacy_type = Partups.privacy_types.PRIVATE;
        } else if (fields.privacy_type_input === 'network_admins') {
            partup.privacy_type = Partups.privacy_types.NETWORK_ADMINS;
        } else if (fields.privacy_type_input === 'network_colleagues') {
            partup.privacy_type = Partups.privacy_types.NETWORK_COLLEAGUES;
        } else if (fields.privacy_type_input === 'network_colleagues_custom_a') {
            partup.privacy_type = Partups.privacy_types.NETWORK_COLLEAGUES_CUSTOM_A;
        } else if (fields.privacy_type_input === 'network_colleagues_custom_b') {
            partup.privacy_type = Partups.privacy_types.NETWORK_COLLEAGUES_CUSTOM_B;
        } else if (fields.privacy_type_input === 'network') {
            switch (network.privacy_type) {
                case Networks.privacy_types.NETWORK_PUBLIC:
                    partup.privacy_type = Partups.privacy_types.NETWORK_PUBLIC;
                    break;
                case Networks.privacy_types.NETWORK_INVITE:
                    partup.privacy_type = Partups.privacy_types.NETWORK_INVITE;
                    break;
                case Networks.privacy_types.NETWORK_CLOSED:
                    partup.privacy_type = Partups.privacy_types.NETWORK_CLOSED;
                    break;
            }
        }

        // Save focuspoint
        Partup.server.services.images.storeFocuspoint(partup.image, fields.focuspoint_x_input || 0, fields.focuspoint_y_input || 0);

        return partup;
    }
};
