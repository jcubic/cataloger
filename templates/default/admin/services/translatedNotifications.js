import $ from 'jquery';

function translatedNotifications(notifications, gettextCatalog) {
    var result = {};
    Object.keys(notifications).forEach(function(key) {
        if (key.match(/^show/)) {
            result[key] = function(options) {
                options = $.extend({}, options, {
                    message: gettextCatalog.getString(options.message)
                });
                return notifications[key](options);
            };
        } else {
            result[key] = notifications[key].bind(notifications);
        }
    });
    return result;
}

translatedNotifications.$inject = ['notifications', 'gettextCatalog'];

export default translatedNotifications;
