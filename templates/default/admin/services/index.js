import angular from 'angular';

import api from './api';
import fileDropHandler from './fileDropHandler';
import scaleImage from './scaleImage';
import popups from './popups';

export default angular.module('services', [])
    .factory('api', api)
    .factory('fileDropHandler', fileDropHandler)
    .factory('scaleImage', scaleImage)
    .factory('popups', popups);
