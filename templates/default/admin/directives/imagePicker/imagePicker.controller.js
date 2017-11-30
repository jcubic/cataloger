/* global FileReader, Image */

let controller = function($scope, $element, fileDropHandler, scaleImage) {
    $element.on('dragover', function(event) {
        if (event.originalEvent) {
            event = event.originalEvent;
        }
        event.dataTransfer.dropEffect = "move";
        return false;
    }).on('drop', (event) => {
        event.preventDefault();
        fileDropHandler(event, this.path, (file, path) => {
            var same = this.images.filter((image) => image.name == file.name);
            if (file.name.match(/(jpe?g|gif|png)$/i) && !same.length) {
                var reader = new FileReader();
                reader.onload = (e) => {
                    var image = new Image();
                    image.src = e.target.result;
                    image.onload = () => {
                        $scope.$apply(() => {
                            this.images.push({
                                src: scaleImage(image, 100),
                                name: file.name
                            });
                        });
                    };
                };
                reader.readAsDataURL(file);
                this.upload(file, path);
            }
        });
    });
    $scope.$on('$destroy', function() {
        $element.off('drop dragover dragstart');
    });
};

controller.$inject = ['$scope', '$element', 'fileDropHandler', 'scaleImage'];

export default controller;
