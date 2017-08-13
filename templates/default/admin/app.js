/* global location, $ */

import $ from 'jquery';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import components from './components';
import './app.css';

let app = angular.module('app', [
    uiRouter,
    components.name
]);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
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
