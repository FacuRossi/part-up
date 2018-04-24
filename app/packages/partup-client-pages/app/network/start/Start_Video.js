Template.Start_Video.helpers({
    data(...args) {
        const { networkSlug: slug } = this;
        const network = Networks.findOne({slug})
        const {
            name: tribename,
            content: {
                video_url,
                video_placeholder_image,
                why_title,
                why_body
            } = {},
        } = network;

        return {
            network,
            video_url: () => video_url || TAPi18n.__('pages-app-network-landing-intro-video-fallback'),
            video_placeholder: () => {
                const image = Images.findOne({_id: video_placeholder_image});
                if (image) return Partup.helpers.url.getImageUrl(image, '360x360');
                return TAPi18n.__('pages-app-home-intro-video-placeholder');
            },
            why_title: () => why_title || TAPi18n.__('pages-app-network-landing-intro-why-title-fallback', {tribename}),
            why_body: () => why_body || TAPi18n.__('pages-app-network-landing-intro-why-body-fallback', {tribename}),
        };
    }
});

Template.Start_Video_Embed.onCreated(function() {
    this.play = new ReactiveVar(false);
});

Template.Start_Video_Embed.events({
    'click [data-play]': function(event, template) {
        template.play.set(true);
    }
});

Template.Start_Video_Embed.helpers({
    play() {
        return Template.instance().play.get();
    },
    isYoutube(url) {
        if (url.indexOf('vimeo') > -1) return false;
        return true;
    },
    youtubeId(url) {
        return Partup.helpers.url.getYoutubeIdFromUrl(url);
    },
    vimeoId(url) {
        return Partup.helpers.url.getVimeoIdFromUrl(url);
    }
});
