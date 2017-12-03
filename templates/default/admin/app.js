/* global location, $, root */

import $ from 'jquery';
import angular from 'angular';
import components from './components';
import directives from './directives';
import services from './services';
import 'bootstrap/dist/css/bootstrap.min.css';
import gettext from 'angular-gettext';
import 'ng-notifications-bar';
import 'ng-notifications-bar/dist/ngNotificationsBar.min.css';
import './app.css';
import pagination from 'angular-ui-bootstrap/src/pagination';
import modal from 'angular-ui-bootstrap/src/modal';

let app = angular.module('app', [
    'ngNotificationsBar',
    pagination,
    modal,
    gettext,
    components.name,
    directives.name,
    services.name
]);

app.factory('config', ['$http', '$location', function($http, $location) {
    var lang = $location.search()['lang'];
    var query = lang ? '?lang=' +  lang : '';
    return $http.get(root + '/api/config' + query).then((response) => response.data);
}]);

app.constant('editorOptions', {
    theme: 'modern',
    skin: 'lightgray',
    menubar: false,
    statusbar: false,
    height: '100%',
    plugins: [
        "advlist code"
    ],
    toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | preview fullpage | forecolor backcolor table | code"
});

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

app.controller('main', function($scope, $rootScope) {
    let set = () => {
        var hash = location.hash.replace(/^#/, '');
        if (hash.match(/^[a-z]+$/)) {
            this.panel = hash;
            $rootScope.$broadcast('view:' + hash);
        }
    };

    $(window).on('hashchange', () => {
        $scope.$apply(set);
    });
    set();
});
