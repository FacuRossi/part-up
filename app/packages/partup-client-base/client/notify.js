/**
 * Create notifications in the ui
 *
 * @class notify
 * @memberof Partup.client
 */

const toastrTimeout = 3500;

if (toastr && jQuery) {
    Partup.client.notify = {};

    /**
     * create info message
     *
     * @memberof Partup.client.notify
     * @param {String} msg message to display in notification
     */
    Partup.client.notify.info = function notifyInfo(msg, options = {}) {
        toastr.info(msg, null, options);
    };

    /**
     * create warning message
     *
     * @memberof Partup.client.notify
     * @param {String} msg message to display in notification
     */
    Partup.client.notify.warning = function notifyWarning(msg, options = {}) {
        toastr.warning(msg, null, options);
    };

    /**
     * create warning success
     *
     * @memberof Partup.client.notify
     * @param {String} msg message to display in notification
     */
    Partup.client.notify.success = function notifySuccess(msg, options = {}) {
        toastr.success(msg, null, options);
    };

    /**
     * create warning error
     *
     * @memberof Partup.client.notify
     * @param {String} msg message to display in notification
     */
    Partup.client.notify.error = function notifyError(msg, options = {}) {
        toastr.error(msg, null, options);
    };

    /**
     * clear all notifications
     *
     * @memberof Partup.client.notify
     */
    Partup.client.notify.clear = function notifyClear() {
        toastr.clear();
    };

    // Toastr configuration
    toastr.options.tapToDismiss = false;
    toastr.options.timeOut = toastrTimeout;
    toastr.options.containerId = 'pu-notifycontainer';
    toastr.options.toastClass = 'pu-toast';
    toastr.options.iconClasses = {
        error: 'pu-toast-error',
        info: 'pu-toast-info',
        success: 'pu-toast-success',
        warning: 'pu-toast-warning'
    };
    toastr.options.iconClass = 'pu-sub-icon';
    toastr.options.positionClass = '';
    toastr.options.titleClass = 'pu-sub-title';
    toastr.options.messageClass = 'pu-sub-message';
    toastr.options.target = 'body';
    toastr.options.newestOnTop = true;
    toastr.options.preventDuplicates = false;
    toastr.options.progressBar = false;
    toastr.options.closeHtml = '';
    toastr.options.showMethod = 'puNotifyIn';
    toastr.options.hideMethod = 'puNotifyOut';
    toastr.options.showDuration = 600;
    toastr.options.hideDuration = 600;

    // Extend jQuery with out notification animation
    jQuery.fn.extend({
        puNotifyIn: function() {
            return this.each(function() {
                var $elm = jQuery(this);
                $elm.show(0);
                $elm.addClass('pu-state-show');
                setTimeout(function puNotifyInCompleted () {
                    $elm.addClass('pu-state-shown');
                }, toastr.options.showDuration);
            });
        },
        puNotifyOut: function(options) {
            return this.each(function() {
                var $elm = jQuery(this);
                $elm.removeClass('pu-state-show');
                setTimeout(function puNotifyOutCompleted () {
                    $elm.hide(0);
                    options.complete();
                }, toastr.options.hideDuration);
            });
        }
    });

}
