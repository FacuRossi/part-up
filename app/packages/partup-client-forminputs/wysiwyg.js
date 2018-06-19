import 'trumbowyg';

Template.Wysiwyg.onCreated(function() {
    var template = this;
    template.placeholder = new ReactiveVar('');
    template.className = new ReactiveVar('');
});
function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}
Template.Wysiwyg.onRendered(function() {
    var template = this;

    var settings = template.data.inputSettings;
    template.placeholder.set(settings.placeholder);
    template.className.set(settings.className);

    template.editor = template.$('[data-wysiwyg]').trumbowyg({
        removeformatPasted: true,
        btnsDef: {
            formattingCustom: {
                dropdown: ['blockquote', 'p'],
                ico: 'formatting' // Apply formatting icon
            },
        },
        btns: [
            ['bold'],
            ['unorderedList'],
            ['formattingCustom'],
            ['link'],
            ['viewHTML']
        ],
        fullscreenable: false,
        closable: false,
        autogrow: true,
        resetCss: true,
        prefix: 'pu-wysiwyg-'
    });
    if (settings.prefill) $(template.editor).trumbowyg('html', settings.prefill);
    var wrapInParagraphIfNoTagsArePresent = function(string) {
        var hasTags = /<[a-z][\s\S]*>/i.test(string);

        if (hasTags) {
            return string;
        } else {
            return '<p>' + string + '</p>';
        }
    };

    template.outputHandler = function(event) {

        // console.log(event, template.editor);
        var output = Partup.client.sanitizeOutputHTML(template.editor.trumbowyg('html'));
        var textOutput = strip(output);

        var wrappedOutput = wrapInParagraphIfNoTagsArePresent(output);

        if (settings.htmlCharacterCountVar) settings.htmlCharacterCountVar.set(wrappedOutput.length);
        if (settings.characterCountVar) settings.characterCountVar.set(textOutput.length);

        $('[' + settings.input + ']').val(wrappedOutput);
    };

    template.editor.on('tbwchange', template.outputHandler);

    lodash.defer(template.outputHandler);
});

Template.Wysiwyg.onDestroyed(function() {
    var template = this;
    template.editor.off('tbwchange', template.outputHandler);
});

Template.Wysiwyg.helpers({
    data: function() {
        var template = Template.instance();
        return {
            placeholder: function() {
                return template.placeholder.get();
            },
            className: function() {
                return template.className.get();
            }
        };
    }
});

Template.Wysiwyg.events({
    'click [contenteditable]': function(event, template) {
        event.preventDefault();
        $(event.currentTarget).focus();
    }
})
