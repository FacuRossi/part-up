import _ from 'lodash';

Template.activityForm.onCreated(function() {
    const instance = this;

    // --- internal state
    this.isSubmitting = new ReactiveVar(false);
    this.partupSelectorToggle = new ReactiveVar(false);
    // ---

    this.partupId = this.data.partupId;
    this.reactivePartupId = new ReactiveVar(this.partupId);

    this.isExistingActivity = Partup.schemas.forms.activity.newContext().isValid(this.data) && !!this.data._id //this.data instanceof Activity;

    this.activity = this.isExistingActivity ? this.data : new Activity();
    this.doSelf = new ReactiveVar(false);

    this.fileController = new FileController();

    this.charactersRemaining = new ReactiveDict();
    this.maxLength = {
        name: Partup.schemas.forms.activity._schema.name.max,
        description: Partup.schemas.forms.activity._schema.description.max,
    };

    const { name, description, files } = this.activity;
    const { documents = [], images = [] } = files || {};

    this.charactersRemaining.set(
        'name',
        this.maxLength.name - (name ? name.length : 0)
    );
    this.charactersRemaining.set(
        'description',
        this.maxLength.description - (description ? description.length : 0)
    );

    if (documents.length) {
        Meteor.call('files.get', documents, function(error, result) {
            if (result && result.length) {
                instance.fileController.addFilesToCache(result);
                return;
            }
            if (error) {
                Partup.client.notify.error(TAPi18n.__(error.reason));
            }
        });
    }
    if (images.length) {
        Meteor.call('images.get', images, function(error, result) {
            if (result && result.length) {
                instance.fileController.addFilesToCache(result);
                return;
            }
            if (error) {
                Partup.client.notify.error(TAPi18n.__(error.reason));
            }
        });
    }

    this.removeFiles = () => {
        const { files } = this.activity;
        if (files) {
            this.fileController.removeAllFilesBesides(
                _.concat(files.images, files.documents)
            );
        }

        $('[data-dismiss]').off('click', this.removeFiles);
    };

    this.reset = () => {
        this.fileController.reset();
        this.isSubmitting.set(false);

        try {
            AutoForm.resetForm('newActivityForm');
            AutoForm.resetForm('editActivityForm');
        } catch (error) {}
    };

    this.destroy = () => {
        this.fileController.destroy();
    };
});

Template.activityForm.onRendered(function() {
    $('[data-dismiss]').on('click', this.removeFiles);
});

Template.activityForm.onDestroyed(function() {
    this.destroy();
});

Template.activityForm.helpers({
    form() {
        const instance = Template.instance();
        const form = {
            id() {
                return instance.activity._id
                    ? 'editActivityForm'
                    : 'newActivityForm';
            },
            schema() {
                return Partup.schemas.forms.activity;
            },
            doc() {
                return instance.activity;
            },
            placeholders: Partup.services.placeholders.activity,
        };
        return form;
    },
    datePickerSettings() {
        return {
            input: 'data-bootstrap-datepicker',
            autoFormInput: 'data-autoform-input',
            prefillValueKey: 'end_date', // autoform key
        };
    },
    charactersRemaining() {
        const { charactersRemaining } = Template.instance();
        return {
            name: () => charactersRemaining.get('name'),
            description: () => charactersRemaining.get('description'),
        };
    },
    fileController() {
        return Template.instance().fileController;
    },
    isSubmitting() {
        return Template.instance().isSubmitting.get();
    },
    isExistingActivity() {
        return Template.instance().isExistingActivity;
    },
    isArchived() {
        return this.archived;
    },
    doSelf() {
        return Template.instance().doSelf.get();
    },
    isPartupIdSet() {
      return  typeof Template.instance().reactivePartupId.get() === 'string';
    },
});

Template.activityForm.events({
    'click [data-dismiss]'(event, templateInstance) {
        templateInstance.removeFiles();
        templateInstance.destroy();
    },
    'input [maxlength]'(event, templateInstance) {
        const { target } = event;
        const newVal =
            templateInstance.maxLength[target.name] - target.value.length;
        templateInstance.charactersRemaining.set(target.name, newVal);

        if (target.name === 'description') {
            $(target).scrollTop(target.scrollHeight);
        }
    },
    'click [data-do]'(event, templateInstance) {
      // event.preventDefault();
      const { doSelf } = templateInstance;
      doSelf.set(!doSelf.get());
    },
    'click [data-archive]'(event, templateInstance) {
        Meteor.call(
            'activities.archive',
            templateInstance.activity._id,
            function(error, result) {
                if (result && result._id) {
                    templateInstance.removeFiles();
                    templateInstance.destroy();
                }
                if (Partup.client.popup.current.get()) {
                    Partup.client.popup.close('edit-activity-$');
                }
            }
        );
    },
    'click [data-unarchive]'(event, templateInstance) {
        Meteor.call('activities.unarchive', templateInstance.activity._id);
    },
    'click [data-remove]'(event, templateInstance) {
        Meteor.call(
            'activities.remove',
            templateInstance.activity._id,
            function(error, result) {
                templateInstance.destroy();
                if (Partup.client.popup.current.get()) {
                    Partup.client.popup.close(null);
                }
            }
        );
    },
});

AutoForm.hooks({
    newActivityForm: {
        onSubmit(insertDoc) {
            const self = this;
            const activityForm = Template.instance().parent();

            if (
                activityForm.fileController.uploading.get() ||
                activityForm.isSubmitting.get()
            ) {
                return false;
            }
            activityForm.isSubmitting.set(true);
            const formData = _.assignIn(insertDoc, {
                files: {
                    images: [],
                    documents: [],
                },
            });

            const laneId = get(Partup.client.popup, 'parameters.laneId');
            if (laneId) {
                formData.lane_id = laneId;
            }

            activityForm.fileController.files.get().forEach((file) => {
                const type = Partup.helpers.files.isImage(file)
                    ? 'images'
                    : 'documents';
                formData.files[type].push(file._id);
            });

            Meteor.call(
                'activities.insert',
                activityForm.partupId,
                formData,
                function(error, result) {
                    if (result && result._id) {
                        if (Partup.client.popup.current.get()) {
                            Partup.client.popup.close(result._id);
                        }
                        try {
                            analytics.track('activity inserted', {
                                partupId: activityForm.partupId,
                            });
                            if (
                                activityForm.data.createCallback &&
                                typeof activityForm.data.createCallback ===
                                    'function'
                            ) {
                                activityForm.data.createCallback(result._id);
                            }
                        } catch (err) {}

                        if (activityForm.doSelf.get()) {
                            Meteor.call('contributions.update', result._id, {}, function(error) {
                                if (error) {
                                    return;
                                }

                                try {
                                    analytics.track('new contribution', {
                                        partupId: activityForm.partupId,
                                        userId: Meteor.userId(),
                                        userType: 'upper',
                                    });
                                } catch (e) {}
                            });
                        }
                        self.done();
                    } else if (error) {
                        AutoForm.validateForm('newActivityForm');
                        self.done(new Error(error.message));
                        if (Partup.client.popup.current.get()) {
                            Partup.client.popup.close(null);
                        }
                        return;
                    }

                    AutoForm.resetForm('newActivityForm');
                    activityForm.reset();
                }
            );
            return false;
        },
    },
    editActivityForm: {
        onSubmit(insertDoc) {
            const self = this;
            const activityForm = Template.instance().parent();

            if (
                activityForm.fileController.uploading.get() ||
                activityForm.isSubmitting.get()
            ) {
                return false;
            }
            activityForm.isSubmitting.set(true);

            const formData = _.assignIn(insertDoc, {
                files: {
                    images: [],
                    documents: [],
                },
            });

            activityForm.fileController.files.get().forEach((file) => {
                const type = Partup.helpers.files.isImage(file)
                    ? 'images'
                    : 'documents';
                formData.files[type].push(file._id);
            });

            Meteor.call(
                'activities.update',
                activityForm.activity._id,
                formData,
                function(error, result) {
                    if (result && result._id) {
                        if (Partup.client.popup.current.get().length) {
                            Partup.client.popup.close(result._id);
                        }
                        try {
                            AutoForm.resetForm('editActivityForm');
                        } catch (err) {
                            throw err;
                        }
                        self.done();
                    } else if (error) {
                        if (Partup.client.popup.current.get().length) {
                            Partup.client.popup.close(null);
                        }
                        Partup.client.notify.error(error.message);
                        AutoForm.validateForm('editActivityForm');
                        self.done(new Error(error.message));
                        return;
                    }

                    AutoForm.resetForm('editActivityForm');
                    activityForm.reset();
                }
            );
            return false;
        },
    },
});
