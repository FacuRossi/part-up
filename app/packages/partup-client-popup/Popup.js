// jscs:disable
/**
 * Renders the popup container, overlay and dismiss handlers
 *
 * @module client-popup
 * @param {contentFor} PopupTitle  the html content for the popup title
 * @param {contentFor} PopupContent  the html content for the popup content
 */
// jscs:enable
Template.Popup.onCreated(function() {
    var template = this;
    template.clickHandler = function(e) {
        e.preventDefault();
        try {
            var id = $(this).data('popup');
            Partup.client.popup.open({
                id: id
            });
        } catch (e) {
            return Partup.client.error('Global [data-popup] on click: ' + e);
        }
    };
    $('body').on('click', '[data-popup]', template.clickHandler);

    template.scrollLeft = 0;
    template.scrollIndex = new ReactiveVar(0);

    template.resizeHandler = function() {
        var scrollIndex = template.scrollIndex.get();
        var width = $('[data-scroller]').width();
        $('[data-scroller]').scrollLeft(width * scrollIndex);
    };
    $(window).on('resize', template.resizeHandler);

    template.finishedLoading = new ReactiveVar(false);

    template.autorun(function() {
        var current = Partup.client.popup.current.get();
        if (!current) {
            template.finishedLoading.set(false);
            return;
        }
        Tracker.nonreactive(function() {
            Meteor.defer(function() {
                var scrollIndex = Partup.client.popup.imageIndex.get();
                template.scrollIndex.set(scrollIndex);
                var width = $(template.find('[data-scroller]')).width();
                $('[data-scroller]').scrollLeft(width * scrollIndex);
                template.finishedLoading.set(true);
            });
        });
    });
});

Template.Popup.onDestroyed(function() {
    var template = this;
    $(window).off('resize', template.resizeHandler);
    $('body').off('click', '[data-popup]', template.clickHandler);
});

Template.Popup.helpers({
    currentPopup: function() {
        return Partup.client.popup.current.get();
    },
    type: function() {
        return Partup.client.popup.currentType.get();
    },
    overflowing: function() {
        return Partup.client.popup.totalImages.get() > 1;
    },
    imageIndex: function() {
        return Partup.client.popup.imageIndex.get();
    },
    galleryStart: function() {
        return Template.instance().scrollIndex.get() === 0;
    },
    galleryEnd: function() {
        return Template.instance().scrollIndex.get() === (Partup.client.popup.totalImages.get() - 1);
    },
    finishedLoading: function() {
        return Template.instance().finishedLoading.get();
    }
});

Template.Popup.events({
    'click [data-overlay-dismiss]': function closePopup(event, template) {
        template.scrollIndex.set(0);
        var $dismissButton = jQuery(event.target).find('[data-dismiss]');
        if (event.target !== event.currentTarget || $dismissButton.length > 0) {
            return;
        }

        try {
            Partup.client.popup.close();
        } catch (e) {
            return Partup.client.error('Popup [data-overlay-dismiss] on click: ' + e);
        }
    },
    'click [data-dismiss]': function closePopup(event, template) {
        template.scrollIndex.set(0);
        var dismiss = $(event.currentTarget).data('dismiss');
        if (dismiss !== 'no-prevent') event.preventDefault();
        try {
            Partup.client.popup.close();
        } catch (e) {
            return Partup.client.error('Popup [data-dismiss] on click: ' + e);
        }
    },
    'click [data-left]': function(event, template) {
        event.preventDefault();
        event.stopPropagation();
        var scrollIndex = template.scrollIndex.get() - 1;
        if (scrollIndex > -1) template.scrollIndex.set(scrollIndex);
        var width = $('[data-scroller]').width();
        $('[data-scroller]').animate({scrollLeft: width * scrollIndex}, 500);
    },
    'click [data-right]': function(event, template) {
        event.preventDefault();
        event.stopPropagation();
        var scrollIndex = template.scrollIndex.get() + 1;
        if (scrollIndex < Partup.client.popup.totalImages.get()) template.scrollIndex.set(scrollIndex);
        var width = $('[data-scroller]').width();
        $('[data-scroller]').animate({scrollLeft: width * scrollIndex}, 500);
    }
});
