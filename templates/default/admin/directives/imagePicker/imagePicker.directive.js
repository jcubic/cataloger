/* global Image, FileReader */

import template from './imagePicker.template.html';
import './imagePicker.css';

function imagePickerDirective(fileDropHandler, scaleImage, root, api) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            images: '=',
            path: '@',
            upload: '&',
            size: '@',
            pageSize: '@'
        },
        transclude: true,
        require: '?ngModel',
        template,
        link: function($scope, $element, $atts, ngModelController) {
            $scope.root = root;
            let newImage = (file, path) => {
                var same = $scope.images.filter(
                        (image) => image.name == file.name
                    );
                    if (file.name.match(/(jpe?g|gif|png)$/i) && !same.length) {
                        var reader = new FileReader();
                        let readImage = () => {
                            reader.onload = (e) => {
                                var image = new Image();
                                image.src = e.target.result;
                                image.onload = () => {
                                    $scope.$apply(() => {
                                        $scope.images.unshift({
                                            src: scaleImage(image, $scope.size),
                                            name: file.name
                                        });
                                    });
                                };
                            };
                            reader.readAsDataURL(file);
                        };
                        let ret = $scope.upload({file, path});
                        if (ret && ret.then) {
                            ret.then(readImage);
                        } else {
                            readImage();
                        }
                    }
            };
            $element.on('dragover', function(event) {
                if (event.originalEvent) {
                    event = event.originalEvent;
                }
                event.dataTransfer.dropEffect = "move";
                return false;
            }).on('drop', (event) => {
                event.preventDefault();
                fileDropHandler(event, $scope.path, newImage);
            });
            let $file = $element.find('.file input').on('change', (e) => {
                newImage(e.target.files[0], $scope.path);
            });
            $scope.top = $element.find('[ng-transclude]').height();
            $scope.$on('$destroy', function() {
                $element.off('drop dragover');
                $file.off('change');
            });
            $scope.select = (image) => {
                $scope.selected = image;
                $scope.expanded = false;
                if (ngModelController) {
                    ngModelController.$setViewValue(image.name);
                }
            };
            $scope.search = () => {
                if ($scope.searchTerm) {
                    var re = new RegExp($scope.searchTerm, 'i');
                    $scope.filteredImages = $scope.images.filter(function(image) {
                        return image.name.match(re);
                    });
                } else {
                    $scope.filteredImages = $scope.images;
                }
            };
            function select(viewValue) {
                $scope.images.forEach((image) => {
                    if (viewValue == image.name) {
                        $scope.selected = image;
                    }
                });
            }
            $scope.pageSize = $scope.pageSize || 4;
            $scope.page = 1;
            $scope.filteredImages = $scope.images;
            $scope.$watch(
                () => [$scope.filteredImages, $scope.page],
                function(newValue, oldValue) {
                    var start = ($scope.page-1) * $scope.pageSize;
                    var end = $scope.page * $scope.pageSize;
                    $scope.pageImages = $scope.filteredImages.slice(start, end);
                },
                true
            );
            /*
            $scope.$watch(
                () => [$scope.filteredImages, $scope.pageSize],
                function(newValue) {
                    var len = $scope.filteredImages.length;
                    $scope.pages = Math.ceil(len / $scope.pageSize);
                },
                true
            );
             */
            ngModelController.$render = () => {
                if (ngModelController.$viewValue) {
                    select(ngModelController.$viewValue);
                }
            };
        }
    };
}

imagePickerDirective.$inject = ['fileDropHandler', 'scaleImage', 'root', 'api'];

export default imagePickerDirective;
