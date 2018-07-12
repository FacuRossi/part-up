import 'trumbowyg';
import _ from 'lodash';

$.trumbowyg.hideButtonTexts = true;
$.trumbowyg.svgPath = '/images/trumbowyg.svg';

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
      prefix: 'pu-wysiwyg-',
      btns: [
        ['bold'],
        ['unorderedList'],
        ['formattingCustom'],
        ['link'],
        ['viewHTML'],
      ],
      btnsDef: {
        formattingCustom: {
          dropdown: ['blockquote', 'p'],
          ico: 'p',
        }
      },
      closable: false,
      fullscreenable: false,
      removeformatPasted: true,
    });

    template.outputHandler = () => {
      const trumboHtml = template.editor.trumbowyg('html');
      const output = Partup.client.sanitizeOutputHTML(trumboHtml);

      const wrapped = Partup.client.html.wrap(output, 'p', false);
      const text = strip(output);

      if (settings.htmlCharacterCountVar) {
        settings.htmlCharacterCountVar.set(wrapped.length);
      }
      if (settings.characterCountVar) {
        settings.characterCountVar.set(text.length);
      }

      $(`[${settings.input}]`).val(wrapped);
    };

    if (settings.prefill) {
      $(template.editor).trumbowyg('html', settings.prefill);
    }

    template.editor.on('tbwchange', template.outputHandler);
    _.defer(template.outputHandler);
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
