/* global angular */

import validateMatch from './validateMatch';
import imagePicker from './imagePicker/imagePicker.directive';



export default angular.module('directives', [])
    .directive('validateMatch', validateMatch)
    .directive('imagePicker', imagePicker);
