Meteor.startup(function() {
    AutoForm.removeArrayItem = function(formId, name, index) {
        var schema = AutoForm.getFormSchema(formId);
        AutoForm.arrayTracker.removeFromFieldAtIndex(formId, name, index, schema);
    };
    AutoForm.addArrayItem = function(formId, name, index) {
        var schema = AutoForm.getFormSchema(formId);
        AutoForm.arrayTracker.addOneToField(formId, name, schema);
    };
});
