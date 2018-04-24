'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getWebsitePathFor;

var _powercheck = require('powercheck');

var _powercheck2 = _interopRequireDefault(_powercheck);

var _array = require('mout/array');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WEB_ROUTES = {
    'network': '/tribes/:slug',
    'network-uppers': '/tribes/:slug/uppers',
    'network-settings-requests': '/tribes/:slug/settings/requests',
    'partup': '/partups/:slug',
    'partup-update': '/partups/:slug/updates/:update_id',
    'partup-activities': '/partups/:slug/activities'
};

function getWebsitePathFor(name, parameters) {
    _powercheck2.default.throw(name, (0, _powercheck.validate)(function (value) {
        return (0, _array.contains)(Object.keys(WEB_ROUTES), value);
    }));

    var route = WEB_ROUTES[name];

    route.split('/').filter(function (route) {
        return route[0] === ':';
    }).map(function (route) {
        return route.substring(1);
    }).forEach(function (param) {
        var value = parameters[param];
        _powercheck2.default.throw(value, String);

        var urlPart = new RegExp(':' + param, 'g');
        route = route.replace(urlPart, value);
    });

    return route;
};
module.exports = exports['default'];