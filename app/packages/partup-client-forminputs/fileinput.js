Template.FileInput.onRendered(function () {
    const template = this
    const settings = this.data.inputSettings
    const pluploadSettings = this.data.pluploadSettings;

    // For some reason, this template get's rendered twice on the PartupSettings modal
    // to prevent the pluploader from initializing twice the settings will only get passed when the Partupsettings template is rendered.
    if (pluploadSettings) {
        pluploadSettings.config.browse_button = 'uploader_button';
        pluploadSettings.config.container = 'uploadwrapper';
        this.uploader = new Pluploader(pluploadSettings);
    } else if (settings) {
        var button = template.find('[' + template.data.inputSettings.button + ']');
        if (!button) {
            button = document.getElementById('uploader_button');
        }
        var input = template.find('[' + template.data.inputSettings.input + ']');
        var multiple = template.data.inputSettings.multiple;

        this.uploader = Partup.client.uploader.create({
            buttonElement: button,
            fileInput: input,
            multiple: multiple,
            onFileChange: function(fileInputEvent) {
                template.data.inputSettings.onFileChange(fileInputEvent);
            },
            onFilesAdded: settings.onFilesAdded,
            onUploadFile: settings.onUploadFile,
            onFileUploaded: settings.onFileUploaded
        });
    }
});

// Template.FileInput.onDestroyed(function() {
//     if (this.uploader && this.uploader.destroy) {
//         this.uploader.destroy();
//     }
// })