import angular from 'angular';

import productPanel from './productPanel/productPanel.component';
import settingsPanel from './settingsPanel/settingsPanel.component';
import pagePanel from './pagePanel/pagePanel.component';
import categoryPanel from './categoryPanel/categoryPanel.component';
import panel from './panel/panel.component';
import 'angular-ui-tinymce';

export default angular.module('components', ['ui.tinymce'])
    .component('productPanel', productPanel)
    .component('settingsPanel', settingsPanel)
    .component('pagePanel', pagePanel)
    .component('categoryPanel', categoryPanel)
    .component('panel', panel);
