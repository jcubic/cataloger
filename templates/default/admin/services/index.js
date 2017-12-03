import angular from 'angular';

import api from './api';
import fileDropHandler from './fileDropHandler';
import scaleImage from './scaleImage';
import translatedNotifications from './translatedNotifications';

export default angular.module('services', [])
    .factory('api', api)
    .factory('fileDropHandler', fileDropHandler)
    .factory('scaleImage', scaleImage)
    .factory('translatedNotifications', translatedNotifications);
