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
        options = Object.assign({}, {
            title: 'Are you sure?',
            buttons: options.type == 'delete' ? {
                ok: {
                    text: 'Yes',
                    class: 'btn-danger'
                },
                cancel: {
                    text: 'No',
                    class: 'btn-default'
                }
            } : {
                ok: {
                    text: 'OK',
                    'class': 'btn-primary'
                },
                cancel: {
                    text: 'Cancel',
                    'class': 'btn-warning'
                }
            }
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
               <button class="btn {{$ctrl.options.buttons.ok.class}}" type="button"
                       ng-click="$ctrl.ok()">
                 {{$ctrl.options.buttons.ok.text | translate}}
               </button>
               <button class="btn {{$ctrl.options.buttons.cancel.class}}" type="button"
                       ng-click="$ctrl.cancel()">
                 {{$ctrl.options.buttons.cancel.text | translate}}
               </button>
            </div>`,
            controller: function controller() {
                this.options = options;
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
