import angular from 'angular';

import api from './api';

export default angular.module('services', [])
    .factory('api', api);
