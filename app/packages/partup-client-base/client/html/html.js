import _ from 'lodash';
import sanitizeHTML from 'sanitize-html';

import { $ } from 'meteor/jquery';

import sanitizeConfig from './_sanitizeConfig';

Partup.client.html = {
    SANITIZE_ACCESS: {
        STANDARD: 'STANDARD',
        LINKS: 'LINKS',
        MARKUP: 'MARKUP',
    },

    sanitize(html, sanitizeAccess) {
        if (!html && typeof html !== 'string') {
            throw new Error('html.sanitize: html input is not valid');
        }
        const config = sanitizeConfig[_.toLower(sanitizeAccess)];
        if (!config) {
            throw new Error(`html.sanitize: Could not find a sanitize configuration for '${sanitizeAccess}'`);
        }

        return sanitizeHTML(html, {
            allowedTags: config.tags,
            allowedAttributes: {
                ...config.attributes,
                '*': ['class'],
            },
            allowedSchemas: ['http', 'https', 'mailto'],
        });
    },

    // this might not be the right place to put this...
    // use, droppable.apply(htmlEl, [args]);
    droppable(activeClass) {
        const self = this.jquery ? this : $(this);
        let ignoreLeave = false;

        self.on('dragenter', function(event) {
            if (event.target !== this) {
                ignoreLeave = true;
            }
            self.addClass(activeClass);
        }).on('dragleave', function(event) {
            if (ignoreLeave) {
                ignoreLeave = false;
                return;
            }
            self.removeClass(activeClass);
        }).on('dragend', function () {
            self.removeClass(activeClass);
        }).on('drop', function () {
            self.removeClass(activeClass);
        });

        self.children().each((child) => {
            $(child).on('dragleave', function (event) {
                event.stopPropagation();
            });
        });
    },

    wrap(string, tag, always = true) {
      if (!string || !string.length > 0) {
        return;
      }

      const htmlString = new HTMLString.String(string);
      const startChar = htmlString.charAt(0);

      if (startChar === -1) {
        return;
      }

      const wrapContent = (content, tag) => `<${tag}>${content}</${tag}>`;

      let output = string;
      if (always) {
        output = wrapContent(output, tag)
      } else {
        if (startChar.tags().length === 0) {
          output = wrapContent(output, tag);
        }
      }

      return output;
    }
};
