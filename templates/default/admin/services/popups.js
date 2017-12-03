import $ from 'jquery';

function popups($uibModal, $q, notifications, gettextCatalog) {
    var result = {};
    Object.keys(notifications).forEach(function(key) {
        if (key.match(/^show/)) {
            result[key] = function(options) {
                options = $.extend({}, options, {
                    message: gettextCatalog.getString(options.message)
                });
                return notifications[key](options);
            };
        } else {
            result[key] = notifications[key].bind(notifications);
        }
    });
    result['prompt'] = function(options) {
        options = $.extend({}, {
            title: 'Are you sure?'
        }, options || {});
        var defer = $q.defer();
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            template: `<div class="modal-header">
               <h3 class="modal-title" id="modal-title">{{$ctrl.title}}</h3>
            </div>
            <div class="modal-body" id="modal-body">
               {{$ctrl.message}}
            </div>
            <div class="modal-footer">
               <button class="btn btn-primary" type="button"
                       ng-click="$ctrl.ok()">OK</button>
               <button class="btn btn-warning" type="button"
                       ng-click="$ctrl.cancel()">Cancel</button>
            </div>`,
            controller: function controller() {
                this.title = gettextCatalog.getString(options.title);
                this.message = gettextCatalog.getString(options.message);
                this.ok = () => {
                    modalInstance.close();
                    defer.resolve();
                };
                this.cancel = () => {
                    modalInstance.close();
                };
            },
            controllerAs: '$ctrl',
            size: 'md',
            resolve: {}
        });
        return defer.promise;
    };
    return result;
}

    popups.$inject = ['$uibModal', '$q', 'notifications', 'gettextCatalog'];

export default popups;
