import _ from 'lodash';
import './plupload/plupload.min';

Pluploader = function Pluploader(options) {

  const config = _.extend({
    url: `${Partup.client.window.location}/files/upload?token=${Accounts._storedLoginToken()}`,
    flash_swf_url: './plupload/runtimes/Moxie.swf',
    silverlight_xap_url: './plupload/runtimes/Moxie.xap',
    filters: {
        max_file_size: Partup.helpers.files.max_file_size,
        prevent_duplicates: true,
    },
    init: {
        Error(uploader, error) {
            // For a list of all plupload errors/codes see http://www.plupload.com/punbb/viewtopic.php?id=917
            switch (error.code) {
                case -500:
                    Partup.client.notify.error(TAPi18n.__(`upload-error${error.code}`));
                    break;
                default:
                    Partup.client.notify.error(TAPi18n.__(`upload-error${error.code}`, { filename: error.file.name }));
                    break;
            }
        }
    },
  }, options.config);

  const uploader = Object.assign(new plupload.Uploader(config), Pluploader.prototype);
  _registerHooks(uploader, options.hooks);

  return uploader;
}

Pluploader.prototype.setMimeFilters = function setMimeFilters() {
  const filters = this.getOption('filters');
  if (!categories) {
    filters.mime_types = [Partup.helpers.files.toUploadFilter('all', Partup.helpers.files.extensions.all)];
  } else {
    filters.mime_types = _.map(categories, category => (Partup.helpers.files.toUploadFilter(category)));
  }
  this.setOption('filters', filters);
};

Pluploader.prototype.addMimeFilter = function addMimeFilter(category) {
    if (!category) {
        return;
    }
    const filters = this.getOption('filters');
    filters.mime_types.push({ title: category, extensions: Partup.helpers.files.extensions[category] });
    this.setOption('filters', filters);
}
Pluploader.prototype.removeMimeFilter = function removeMimeFilter(name) {
    if (!name) {
        return;
    }
    const filters = this.getOption('filters');
    _.remove(filters.mime_types, {
        title: name,
    });
    this.setOption('filters', filters);
}
Pluploader.prototype.setMaxFileSize = function setMaxFileSize(size) {
    const binarySize = Partup.helpers.files.shortToBinarySize(size);
    if (!binarySize) {
        throw new Meteor.Error(0, 'could not set max file size');
    }

    const filters = this.getOption('filters');
    filters.max_file_size = binarySize;
    this.setOption('filters', filters);
}

// Register any hook that matches the plupload API
const _registerHooks = (uploader, hooks) => {
    if (hooks) {
        _.each(Object.keys(hooks), key => uploader.bind(key, hooks[key]));
    }
};
