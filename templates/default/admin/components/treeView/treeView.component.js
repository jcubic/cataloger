import template from './treeView.template.html';

export default {
    bindings: {
        'click_item': '&click',
        'delete_item': '&delete'
    },
    require: {
        ngModel: '^ngModel'
    },
    controller: function() {
        this.$onInit = () => {
            this.ngModel.$render = () => {
                this.tree = this.ngModel.$viewValue;
            };
        };
    },
    controllerAs: 'ctrl',
    template
};
