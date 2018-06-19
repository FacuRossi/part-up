Template.NetworkSettingsLanding.onCreated(function() {
    const userId = Meteor.userId();
    const { networkSlug: slug } = this.data;

    this.editingBlocks = new ReactiveVar([]);
    this.imageUploading = new ReactiveVar(false);
    this.whyCharacterCount = new ReactiveVar(0);
    this.chatCharacterCount = new ReactiveVar(0);
    this.aboutCharacterCount = new ReactiveVar(0);
    this.submitting = new ReactiveVar(false);
    this.imagePreviewId = new ReactiveVar();

    this.subscribe('networks.one', slug, {
        onReady: () => {
            var network = Networks.findOne({slug});
            if (!network) Router.pageNotFound('network');
            if (network.isClosedForUpper(userId)) Router.pageNotFound('network');
        }
    });

    this.onFileChange = (fileChangeEvent) => {
        Partup.client.uploader.eachFile(fileChangeEvent, (file) => {
            this.imageUploading.set(true);

            Partup.client.uploader.uploadImage(file, (error, image) => {
                this.imageUploading.set(false);
                if (error) return Partup.client.notify.error(TAPi18n.__(error.reason));

                this.find('[name=video_placeholder_image]').value = image._id;
                this.imagePreviewId.set(image._id);
            });
        });
    }
});

Template.NetworkSettingsLanding.helpers({
    form(...args) {
        const { networkSlug: slug } = this;
        const network = Networks.findOne({slug});
        const {
            whyCharacterCount,
            chatCharacterCount,
            aboutCharacterCount,
            onFileChange,
        } = Template.instance();
        const {
            name,
            content: {
                why_body,
                chat_body,
                about_body,
                ...restContent
            } = {}
        } = network || {};

        return {
            schema: () => Partup.schemas.forms.networkContent,
            doc: () => ({
                why_body,
                about_body,
                chat_body,
                ...restContent,
            }),
            imageInput: () => {
                return {
                    button: 'data-image-browse',
                    input: 'data-image-input',
                    onFileChange: (event) => onFileChange(event),
                };
            },
            whyBodyInput: {
                input: 'data-why-body',
                className: 'pu-wysiwyg',
                placeholder: TAPi18n.__('network-settings-landing-form-why-body-placeholder', {tribename: name}),
                prefill: why_body,
                maxCharacters: Partup.schemas.forms.networkContent._schema.why_body.max,
                characterCountVar: whyCharacterCount
            },
            chatBodyInput: {
                input: 'data-chat-body',
                className: 'pu-wysiwyg',
                placeholder: TAPi18n.__('network-settings-landing-form-chat-body-placeholder', {tribename: name}),
                prefill: chat_body,
                maxCharacters: Partup.schemas.forms.networkContent._schema.chat_body.max,
                characterCountVar: chatCharacterCount
            },
            aboutBodyInput: {
                input: 'data-about-body',
                className: 'pu-wysiwyg',
                placeholder: TAPi18n.__('network-settings-landing-form-about-body-placeholder', {tribename: name}),
                prefill: about_body,
                maxCharacters: Partup.schemas.forms.networkContent._schema.about_body.max,
                characterCountVar: aboutCharacterCount
            },
        };
    },
    state(...args) {
        const {
            whyCharacterCount,
            chatCharacterCount,
            aboutCharacterCount,
            imageUploading,
        } = Template.instance();
        return {
            whyCharacterCount: () => whyCharacterCount.get(),
            chatCharacterCount: () => chatCharacterCount.get(),
            aboutCharacterCount: () => aboutCharacterCount.get(),
            imageUploading: () => imageUploading.get(),
        };
    },
    data(...args) {
        const { networkSlug: slug } = this;
        const network = Networks.findOne({slug});
        const { imagePreviewId } = Template.instance();
        return {
            previewImage: () => {
                const imageId = lodash.get(network, 'content.video_placeholder_image', imagePreviewId.get());
                if (imageId) {
                    const image = Images.findOne({_id: imageId});
                    if (image) return Partup.helpers.url.getImageUrl(image, '360x360');
                }
                return '/images/closed_network_video.png';
            },
        };
    },
    placeholders(...args) {
        const { networkSlug: slug } = this;
        const { name } = Networks.findOne({slug}) || {};
        return {
            video_url: () => TAPi18n.__('network-settings-landing-form-video-url-placeholder'),
            why_title: () => TAPi18n.__('network-settings-landing-form-why-title-placeholder', {tribename: name}),
            chat_title: () => TAPi18n.__('network-settings-landing-form-chat-title-placeholder', {tribename: name}),
            chat_subtitle: () => TAPi18n.__('network-settings-landing-form-chat-subtitle-placeholder', {tribename: name}),
            about_title: () => TAPi18n.__('network-settings-landing-form-about-title-placeholder', {tribename: name}),
        };
    }
});

AutoForm.addHooks('networkEditLandingForm', {
    onSubmit: function(doc) {
        const template = this.template.parent();
        const { networkSlug: slug } = template.data;

        template.submitting.set(true);

        Meteor.call('networks.update_content', slug, doc, (err) => {
            template.submitting.set(false);

            if (err && err.message) {
                Partup.client.notify.error(err.reason);
                return;
            }

            Partup.client.notify.success(TAPi18n.__('network-settings-form-saved'));
            this.done();
        });

        return false;
    }
});
