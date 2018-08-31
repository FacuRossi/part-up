Template.ContentBlockForm.onCreated(function() {
    var template = this;
    template.settings = template.data.formSettings;
    template.uploading = new ReactiveVar(false);
    template.submitting = new ReactiveVar(false);
    template.currentImage = new ReactiveVar();
    template.characterCount = new ReactiveVar(0);
    template.htmlCharacterCount = new ReactiveVar(0);

    var blockId = template.data.block._id;
    AutoForm.addHooks(blockId, {
        onSubmit: function(doc) {
            if (template.view.isDestroyed) return false;

            if (template.characterCount.get() > 999) return false;
            if (template.htmlCharacterCount.get() > 2000) return false;

            var self = this;
            self.event.preventDefault();
            template.submitting.set(true);

            template.settings.onSubmit(blockId, doc, function() {
                template.submitting.set(false);
                self.done();
            });

            return false;
        }
    });
});

Template.ContentBlockForm.helpers({
    data: function() {
        var template = Template.instance();
        return {
            imageUrl: function(id) {
                var imageId = id || template.currentImage.get();

                if (!imageId) return '/images/smile.png';

                if (imageId) {
                    var image = Images.findOne({_id: imageId});
                    if (image) return Partup.helpers.url.getImageUrl(image, '360x360');
                }

            },
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            imageUploading: function() {
                return !!template.uploading.get();
            },
            submitting: function() {
                return !!template.submitting.get();
            },
            textCharactersLeft: function() {
                return 999 - template.characterCount.get();
            },
        };
    },
    form: function() {
        var template = Template.instance();
        var settings = template.settings;
        return {
            contentBlockInput: {
                input: 'data-paragraph',
                className: 'pu-wysiwyg',
                placeholder: TAPi18n.__('network-settings-about-form-placeholder-text'),
                prefill: template.data.block.text || false,
                maxCharacters: Partup.schemas.forms.contentBlock._schema.text.max,
                characterCountVar: template.characterCount,
                htmlCharacterCountVar: template.htmlCharacterCount,
            },
            doc: template.data.block,
            schema: Partup.schemas.forms.contentBlock,
            id: template.data.block._id,
            type: function() {
                return settings.type;
            },
            imageInput: function() {
                return {
                    button: 'data-image-browse',
                    input: 'data-image-input',
                    onFileChange: function(event) {
                        Partup.client.uploader.eachFile(event, function(file) {
                            template.uploading.set(true);

                            Partup.client.uploader.uploadImage(file, function(error, image) {
                                template.uploading.set(false);

                                if (error) {
                                    Partup.client.notify.error(TAPi18n.__(error.reason));
                                    return;
                                }

                                template.find('[name=image]').value = image._id;
                                template.currentImage.set(image._id);
                            });

                        });

                    }
                };
            },
        };
    }
});

Template.ContentBlockForm.events({
    'click [data-remove]': function(event, template) {
        event.preventDefault();
        template.settings.onRemove(template.data.block._id);
    },
    'click [data-close]': function(event, template) {
        event.preventDefault();
        template.settings.onClose(template.data.block._id);
    }
});

