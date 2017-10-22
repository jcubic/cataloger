import angular from 'angular';

import productPanel from './productPanel/productPanel.component';
import settingsPanel from './settingsPanel/settingsPanel.component';
import panel from './panel/panel.component';


export default angular.module('components', [])
    .component('productPanel', productPanel)
    .component('settingsPanel', settingsPanel)
    .component('panel', panel);
