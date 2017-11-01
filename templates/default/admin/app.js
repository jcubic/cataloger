/* global location, $, root */

import $ from 'jquery';
import angular from 'angular';
import components from './components';
import directives from './directives';
import 'bootstrap/dist/css/bootstrap.min.css';
import gettext from 'angular-gettext';
import 'ng-notifications-bar';
import 'ng-notifications-bar/dist/ngNotificationsBar.min.css';
import './app.css';

let app = angular.module('app', [
    'ngNotificationsBar',
    gettext,
    components.name,
    directives.name
]);

app.factory('config', ['$http', '$location', function($http, $location) {
    var lang = $location.search()['lang'];
    var query = lang ? '?lang=' +  lang : '';
    return $http.get(root + '/api/config' + query).then((response) => response.data);
}]);

app.config([
    '$locationProvider', 'notificationsConfigProvider',
    function($locationProvider, notificationsConfigProvider) {
        notificationsConfigProvider.setAutoHide(true);
        notificationsConfigProvider.setHideDelay(3000);
        $locationProvider.html5Mode(true);
    }
]).run(['gettextCatalog', 'config', function(gettextCatalog, config) {
    config.then(function(config) {
        gettextCatalog.setCurrentLanguage(config.locale);
    });
    gettextCatalog.debug = true;
}]);





app.controller('main', function($scope) {
    let set = () => {
        this.panel = location.hash.replace(/^#/, '');
    };

    $(window).on('hashchange', () => {
        $scope.$apply(set);
    });
    set();
});
