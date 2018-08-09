Template.Dropdown.onRendered(function() {
    const template = this;
    const dropdown_element = template.find('[data-dropdown]');

    // This solves the problem that the dropdown is closed before it could open caused by the onClickOutside handler above
    let click_outside_checker_enabled = false;

    // Capture outside click
    template.handler = Partup.client.elements.onClickOutside([dropdown_element], function() {
        if (!click_outside_checker_enabled) return;

        // Disable the dropdown
        template.data.toggle.set(false);
    });

    template.autorun(function() {
        click_outside_checker_enabled = template.data.toggle.get();
    });
});

Template.Dropdown.onDestroyed(function() {
    var template = this;
    Partup.client.elements.offClickOutside(template.handler);
});

Template.Dropdown.helpers({

    // Hydrate the template data with the 'active'-reactivevar
    templateData: function() {
        var data = this.data || {};
        data.isActive = this.toggle;
        return data;
    },

    // To be able to toggle a class when the dropdown is active
    isActive: function() {
        return this.toggle.get();
    },

    classes: function () {
        return this.classes
    }
});
