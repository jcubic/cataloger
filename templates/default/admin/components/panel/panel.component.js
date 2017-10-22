import template from './panel.template.html';
import controller from './panel.controller';
import './panel.css';

export default {
    bindings: {
        name: '@'
    },
    require: {
        main: '^ngController'
    },
    transclude: true,
    controller,
    template,
    controllerAs: 'ctrl'
};
