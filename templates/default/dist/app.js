webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _angular = __webpack_require__(3);

var _angular2 = _interopRequireDefault(_angular);

var _components = __webpack_require__(9);

var _components2 = _interopRequireDefault(_components);

var _directives = __webpack_require__(37);

var _directives2 = _interopRequireDefault(_directives);

var _services = __webpack_require__(43);

var _services2 = _interopRequireDefault(_services);

__webpack_require__(48);

var _angularGettext = __webpack_require__(54);

var _angularGettext2 = _interopRequireDefault(_angularGettext);

__webpack_require__(56);

__webpack_require__(57);

__webpack_require__(59);

var _pagination = __webpack_require__(61);

var _pagination2 = _interopRequireDefault(_pagination);

var _modal = __webpack_require__(68);

var _modal2 = _interopRequireDefault(_modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global location, $, root */

var app = _angular2.default.module('app', ['ngNotificationsBar', _pagination2.default, _modal2.default, _angularGettext2.default, _components2.default.name, _directives2.default.name, _services2.default.name]);

app.factory('config', ['$http', '$location', function ($http, $location) {
    var lang = $location.search()['lang'];
    var query = lang ? '?lang=' + lang : '';
    return $http.get(root + '/api/config' + query).then(function (response) {
        return response.data;
    });
}]);

app.constant('editorOptions', {
    theme: 'modern',
    skin: 'lightgray',
    menubar: false,
    statusbar: false,
    height: '100%',
    plugins: ["advlist code"],
    toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | preview fullpage | forecolor backcolor table | code"
});

app.config(['$locationProvider', 'notificationsConfigProvider', function ($locationProvider, notificationsConfigProvider) {
    notificationsConfigProvider.setAutoHide(true);
    notificationsConfigProvider.setHideDelay(3000);
    $locationProvider.html5Mode(true);
}]).run(['gettextCatalog', 'config', function (gettextCatalog, config) {
    config.then(function (config) {
        gettextCatalog.setCurrentLanguage(config.locale);
    });
    gettextCatalog.debug = true;
}]);

app.controller('main', function ($scope, $element, $rootScope) {
    var _this = this;

    var set = function set() {
        var hash = location.hash.replace(/^#/, '');
        if (hash.match(/^[a-z]+$/)) {
            _this.panel = hash;
            $rootScope.$broadcast('view:' + hash);
        }
    };
    (0, _jquery2.default)(window).on('hashchange', function () {
        $scope.$apply(set);
    });
    set();
});

/***/ }),
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = __webpack_require__(3);

var _angular2 = _interopRequireDefault(_angular);

var _productPanel = __webpack_require__(10);

var _productPanel2 = _interopRequireDefault(_productPanel);

var _settingsPanel = __webpack_require__(16);

var _settingsPanel2 = _interopRequireDefault(_settingsPanel);

var _pagePanel = __webpack_require__(19);

var _pagePanel2 = _interopRequireDefault(_pagePanel);

var _categoryPanel = __webpack_require__(24);

var _categoryPanel2 = _interopRequireDefault(_categoryPanel);

var _panel = __webpack_require__(29);

var _panel2 = _interopRequireDefault(_panel);

var _treeView = __webpack_require__(34);

var _treeView2 = _interopRequireDefault(_treeView);

__webpack_require__(36);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('components', ['ui.tinymce']).component('productPanel', _productPanel2.default).component('settingsPanel', _settingsPanel2.default).component('pagePanel', _pagePanel2.default).component('categoryPanel', _categoryPanel2.default).component('treeView', _treeView2.default).component('panel', _panel2.default);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _productPanelTemplate = __webpack_require__(11);

var _productPanelTemplate2 = _interopRequireDefault(_productPanelTemplate);

var _productPanel = __webpack_require__(12);

var _productPanel2 = _interopRequireDefault(_productPanel);

__webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    template: _productPanelTemplate2.default,
    controller: _productPanel2.default,
    controllerAs: 'ctrl'
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "<panel name=\"products\" class=\"split\">\n  <nav class=\"selectable-list\">\n    <ul>\n      <li><a ng-click=\"ctrl.new_product()\" translate>new product</a></li>\n      <li ng-repeat=\"product in ctrl.products track by $index\"\n          ng-class=\"{selected: ctrl.product == product}\">\n        <a ng-click=\"ctrl.view(product)\">{{product.name}}</a>\n        <a ng-click=\"ctrl.delete_product($index)\">x</a>\n      </li>\n    </ul>\n  </nav>\n  <div class=\"right\" ng-if=\"ctrl.product\">\n    <form name=\"product\">\n      <div class=\"input-group\">\n        <label class=\"input-group-addon\" for=\"name\" translate>name</label>\n        <input class=\"form-control\" id=\"name\" ng-model=\"ctrl.product.name\"/>\n      </div>\n      <div class=\"input-group\">\n        <label class=\"input-group-addon\" for=\"image\" translate>image</label>\n        <image-picker images=\"ctrl.images\" path=\"uploads\"\n                      upload=\"ctrl.upload(file, path)\"\n                      ng-model=\"ctrl.product.image_name\" size=\"50\">\n          <input class=\"form-control\" ng-model=\"ctrl.product.image_name\" readonly/>\n        </image-picker>\n      </div>\n      <div class=\"input-group\">\n        <label class=\"input-group-addon\" for=\"price\" translate>price</label>\n        <input class=\"form-control\" id=\"price\" ng-model=\"ctrl.product.price\"/>\n      </div>\n      <div class=\"input-group\">\n        <label class=\"input-group-addon\" for=\"category\" translate>category</label>\n        <select ng-options=\"item as item.name for item in ctrl.categories track by item.id\"\n                ng-model=\"ctrl.product.category\" class=\"form-control\" ng-required></select>\n      </div>\n      <div class=\"input-group editor\">\n        <textarea ui-tinymce=\"ctrl.tinymce_options\" class=\"form-control\" ng-model=\"ctrl.product.content\"></textarea>\n      </div>\n      <div class=\"right input-group\">\n        <input class=\"btn btn-default\" type=\"button\" ng-value=\"'save' | translate\" ng-click=\"ctrl.save()\" />\n      </div>\n    </form>\n  </div>\n</panel>\n";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/* global root */

function controller($http, $scope, popups, api, editorOptions) {
    var _this = this;

    this.tinymce_options = editorOptions;
    this.products = [];
    this.images = [];
    var make_setter = function make_setter(variable) {
        return function (data) {
            return _this[variable] = data;
        };
    };
    this.get_images = function () {
        api.images.list().then(function (images) {
            _this.images = images.map(function (name) {
                return { name: name };
            });
        });
    };
    this.get_categories = function () {
        api.categories.list().then(make_setter('categories'));
    };
    this.get_products = function () {
        api.products.list().then(make_setter('products'));
    };
    var product_saved = function product_saved() {
        popups.showSuccess({
            message: 'Save successfull'
        });
        _this.get_products();
    };
    var new_product = function new_product() {
        api.products.post({
            name: _this.product.name,
            price: _this.product.price || null,
            content: _this.product.content || null,
            image_name: _this.product.image_name || null,
            category: _this.product.category ? _this.product.category.id : null
        }).then(product_saved);
    };
    var update = function update() {
        api.products.post({
            name: _this.product.name,
            price: _this.product.price || null,
            content: _this.product.content || null,
            image_name: _this.product.image_name || null,
            category: _this.product.category ? _this.product.category.id : null,
            id: _this.product.id
        }).then(product_saved);
    };
    this.new_product = function () {
        var untitled = _this.products.filter(function (product) {
            return product.name.match(/^untitled/);
        });
        _this.products.push({
            name: 'untitled ' + (untitled.length + 1)
        });
    };
    this.save = function () {
        if (_this.product.id) {
            update();
        } else {
            new_product();
        }
    };
    this.view = function (product) {
        _this.product = product;
        if (_this.product.category && !_this.product.category.id) {
            for (var i = 0; i < _this.categories.length; ++i) {
                var category = _this.categories[i];
                if (category.id == _this.product.category) {
                    _this.product.category = category;
                    break;
                }
            }
        }
    };
    this.delete_product = function (index) {
        var product = _this.products[index];
        var id = product.id;
        popups.prompt({
            message: 'Are you sure you want to delete this product?',
            type: 'delete'
        }).then(function () {
            if (typeof id === 'undefined') {
                var name = product.name;
                _this.products = _this.products.filter(function (page) {
                    return page.name != name;
                });
            } else {
                api.products.delete(id).then(function (data) {
                    if (data.result) {
                        _this.products = _this.products.filter(function (product) {
                            return product.id != id;
                        });
                    }
                });
            }
        });
    };
    this.upload = function (file) {
        console.log(file);
        api.images.upload(file);
    };
    var init = function init() {
        _this.get_products();
        _this.get_categories();
        _this.get_images();
        delete _this.product;
    };
    init();
    $scope.$on('view:products', init);
};

controller.$inject = ['$http', '$scope', 'popups', 'api', 'editorOptions'];

exports.default = controller;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./productPanel.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./productPanel.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "panel[name=\"products\"] .editor {\n    height: 400px;\n}\npanel[name=\"products\"] nav .selected a {\n    background-color: #222d32;\n    color: white;\n}\n", ""]);

// exports


/***/ }),
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _settingsPanelTemplate = __webpack_require__(17);

var _settingsPanelTemplate2 = _interopRequireDefault(_settingsPanelTemplate);

var _settingsPanel = __webpack_require__(18);

var _settingsPanel2 = _interopRequireDefault(_settingsPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    template: _settingsPanelTemplate2.default,
    controller: _settingsPanel2.default,
    controllerAs: 'ctrl'
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "<panel name=\"settings\">\n  <div>\n    <header><h2 translate>password</h2></header>\n    <form id=\"password\" name=\"password\">\n      <div class=\"form-group\">\n        <label class=\"control-label\" for=\"old_password\" translate>old password</label>\n        <input class=\"form-control\" id=\"old_password\" type=\"password\" ng-model=\"ctrl.password.old\" />\n      </div>\n      <div class=\"form-group\">\n        <label class=\"control-label\" for=\"new_password\" translate>new password</label>\n        <input class=\"form-control\" id=\"new_password\" type=\"password\" name=\"new_password\"\n               ng-model=\"ctrl.password.new\" />\n      </div>\n      <div class=\"form-group\" ng-class=\"{'has-error': password.confirm_password.$error.notMatch}\">\n        <label class=\"control-label\" for=\"confirm_password\" type=\"password\" translate>confirm password</label>\n        <input class=\"form-control\" id=\"confirm_password\" name=\"confirm_password\" type=\"password\"\n               ng-model=\"ctrl.password.confirm\" validate-match=\"ctrl.password.new\" />\n        <p ng-show=\"password.confirm_password.$error.notMatch\" class=\"error\" translate>passwords do not match</span>\n      </div>\n    </form>\n  </div>\n  <button class=\"btn btn-default\" ng-click=\"ctrl.save()\" translate>save</button>\n</panel>\n";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
function controller($http) {
    var _this = this;

    this.products = [];
    var get = function get(url, variable) {
        $http({ method: 'GET', url: root + url }).then(function (response) {
            _this[variable] = response.data;
        });
    };
    this.password = {};
    this.save_password = function () {};
};

controller.$inject = ['$http'];

exports.default = controller;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _pagePanelTemplate = __webpack_require__(20);

var _pagePanelTemplate2 = _interopRequireDefault(_pagePanelTemplate);

var _pagePanel = __webpack_require__(21);

var _pagePanel2 = _interopRequireDefault(_pagePanel);

__webpack_require__(22);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    template: _pagePanelTemplate2.default,
    controller: _pagePanel2.default,
    controllerAs: 'ctrl'
};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "<panel name=\"pages\" class=\"split\">\n  <nav class=\"selectable-list\">\n    <ul>\n      <li><a ng-click=\"ctrl.new_page()\" translate>new page</a></li>\n      <li ng-repeat=\"page in ctrl.pages track by $index\"\n          ng-class=\"{selected: page == ctrl.page}\">\n        <a ng-click=\"ctrl.view(page)\">{{page.title}}</a>\n        <a ng-click=\"ctrl.delete_page($index)\">x</a>\n      </li>\n    </ul>\n  </nav>\n  <div class=\"right\" ng-if=\"ctrl.page\">\n    <form name=\"page\">\n      <div class=\"input-group\">\n        <label class=\"input-group-addon\" for=\"title\" translate>title</label>\n        <input class=\"form-control\" id=\"title\" ng-model=\"ctrl.page.title\"/>\n      </div>\n      <div class=\"input-group editor\">\n        <textarea ui-tinymce=\"ctrl.tinymce_options\" class=\"form-control\" ng-model=\"ctrl.page.content\"></textarea>\n      </div>\n      <div class=\"right input-group\">\n        <input class=\"btn btn-default\" type=\"button\" ng-value=\"'save' | translate\" ng-click=\"ctrl.save()\" />\n      </div>\n    </form>\n  </div>\n</panel>\n";

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function controller($http, popups, editorOptions, api) {
    var _this = this;

    this.tinymce_options = editorOptions;
    this.products = [];
    var get = function get(url, variable) {
        api.pages.list().then(function (data) {
            return _this[variable] = data;
        });
    };
    this.get_pages = function () {
        get('/api/page/list', 'pages');
    };
    var new_page = function new_page() {
        var title = _this.page.title;
        api.pages.post({
            title: title,
            content: _this.page.content
        }).then(function (data) {
            if (data.result !== false) {
                _this.pages.forEach(function (page) {
                    if (page.title == title) {
                        page.id = data.result[0];
                    }
                });
                popups.showSuccess({
                    message: 'Save successfull'
                });
            }
        });
    };
    var update = function update() {
        api.pages.post({
            id: _this.page.id,
            title: _this.page.title,
            content: _this.page.content
        }).then(function (data) {
            if (data.result) {
                popups.showSuccess({
                    message: 'Save successfull'
                });
            }
        });
    };
    this.delete_page = function (index) {
        var page = _this.pages[index];
        var id = page.id;
        popups.prompt({
            message: 'Are you sure you want to delete this page?',
            type: 'delete'
        }).then(function () {
            if (typeof id === 'undefined') {
                var title = page.title;
                _this.pages = _this.pages.filter(function (page) {
                    return page.title != title;
                });
            } else {
                api.pages.delete(id).then(function (data) {
                    if (data.result) {
                        _this.pages = _this.pages.filter(function (page) {
                            return page.id != id;
                        });
                    }
                });
            }
        });
    };
    this.save = function () {
        if (!_this.page.id) {
            new_page();
        } else {
            update();
        }
    };

    this.new_page = function () {
        var untitled = _this.pages.filter(function (page) {
            return page.title.match(/^untitled/);
        });
        _this.pages.push({
            title: 'untitled ' + (untitled.length + 1),
            content: ''
        });
    };
    this.view = function (page) {
        _this.page = page;
    };
    this.get_pages();
} /* global root */

;

controller.$inject = ['$http', 'popups', 'editorOptions', 'api'];

exports.default = controller;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./pagePanel.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./pagePanel.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "panel[name=\"pages\"] .panel .editor.input-group {\n    height: calc(100% - 54px - 54px);\n}\n", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _categoryPanelTemplate = __webpack_require__(25);

var _categoryPanelTemplate2 = _interopRequireDefault(_categoryPanelTemplate);

var _categoryPanel = __webpack_require__(26);

var _categoryPanel2 = _interopRequireDefault(_categoryPanel);

__webpack_require__(27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    template: _categoryPanelTemplate2.default,
    controller: _categoryPanel2.default,
    controllerAs: 'ctrl'
};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "<panel name=\"categories\" class=\"split\">\n  <nav>\n    <a ng-click=\"ctrl.new_category()\" translate>new category</a>\n    <tree-view ng-model=\"ctrl.tree\" click=\"ctrl.view(node)\" delete=\"ctrl.delete(node)\"></tree-view>\n  </nav>\n  <div class=\"right\" ng-if=\"ctrl.category\">\n    <form name=\"category\">\n      <div class=\"input-group\">\n        <label class=\"input-group-addon\" for=\"name\" translate>name</label>\n        <input class=\"form-control\" id=\"name\" ng-model=\"ctrl.category.data.name\"/>\n      </div>\n      <div class=\"input-group\" ng-if=\"ctrl.parents.length\" >\n        <label class=\"input-group-addon\" for=\"parent\" translate>parent category</label>\n        <select ng-options=\"item as item.name for item in ctrl.parents track by item.id\"\n                ng-model=\"ctrl.category.parent\" class=\"form-control\"></select>\n      </div>\n      <div class=\"input-group editor\">\n        <textarea ui-tinymce=\"ctrl.tinymce_options\" class=\"form-control\" ng-model=\"ctrl.category.data.content\">\n        </textarea>\n      </div>\n      <div class=\"right input-group\">\n        <input class=\"btn btn-default\" type=\"button\" ng-value=\"'save' | translate\" ng-click=\"ctrl.save()\" />\n      </div>\n    </form>\n  </div>\n</panel>\n";

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function controller($scope, $http, notifications, gettextCatalog) {
    var _this = this;

    this.tinymce_options = {
        theme: 'modern',
        skin: 'lightgray',
        menubar: false,
        statusbar: false,
        height: '100%',
        plugins: ["advlist code"],
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | preview fullpage | forecolor backcolor table | code"
    };
    this.categories = [];
    this.tree = [];
    var get = function get(url, variable) {
        return $http({ method: 'GET', url: root + url }).then(function (response) {
            _this[variable] = response.data;
        });
    };
    var post = function post(options) {
        return $http({
            method: 'POST',
            url: root + options.url,
            data: _jquery2.default.param(options.data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(function (response) {
            return response.data;
        });
    };
    function make_tree(array, fn, filter) {
        if (!filter) {
            filter = array.filter(function (item) {
                return !item.parent || item.parent == "0";
            });
        }
        if (!filter.length) {
            return [];
        }
        return filter.map(function (item) {
            return _jquery2.default.extend({
                nodes: make_tree(array, fn, array.filter(function (node) {
                    return node.parent == item.id;
                }))
            }, fn(item));
        });
    }
    var treefy = function treefy() {
        _this.tree = make_tree(_this.categories, function (node) {
            return {
                name: node.name,
                data: node
            };
        });
    };
    this.get_categories = function () {
        get('/api/category/list', 'categories').then(treefy);
    };
    var new_category = function new_category() {
        var name = _this.category.data.name;
        post({
            url: '/api/category/',
            data: {
                name: name,
                content: _this.category.data.content,
                parent: _this.category.parent ? _this.category.parent.id : null
            }
        }).then(function (data) {
            if (data.result !== false) {
                _this.categories.forEach(function (category) {
                    if (category.name == name) {
                        category.id = data.result[0];
                        delete category.new_item;
                    }
                });
                notifications.showSuccess({
                    message: gettextCatalog.getString('Save successfull')
                });
            }
        });
    };
    var update = function update() {
        post({
            url: '/api/category/',
            data: {
                id: _this.category.data.id,
                name: _this.category.data.name,
                content: _this.category.data.content,
                parent: _this.category.parent.id
            }
        }).then(function (data) {
            if (data.result) {
                notifications.showSuccess({
                    message: gettextCatalog.getString('Save successfull')
                });
            }
        });
    };
    this.delete_category = function (index) {
        var category = _this.categories[index];
        var id = category.id;
        if (typeof id === 'undefined' || typeof id == 'string' && id.match(/^new [0-9]+$/)) {
            var name = category.name;
            _this.categories = _this.categories.filter(function (category) {
                return category.name != name;
            });
        } else {
            $http({
                method: 'DELETE',
                url: root + '/api/page/' + id
            }).then(function (response) {
                if (response.data.result) {
                    _this.categories = _this.categories.filter(function (category) {
                        return category.id != id;
                    });
                }
            });
        }
    };
    this.save = function () {
        if (_this.category.data.new_item) {
            new_category();
        } else {
            update();
        }
    };
    this.new_category = function () {
        var new_items = _this.categories.filter(function (category) {
            return category.new_item;
        });
        var name = 'new ' + (new_items.length + 1);
        _this.categories.push({
            name: name,
            id: name,
            content: '',
            new_item: true
        });
        treefy();
    };
    var listener = void 0;
    this.view = function (category) {
        if (_this.category) {
            delete _this.category.class;
        }
        _this.category = category;
        _this.category.class = 'selected';
        _this.category.parent = _this.categories.filter(function (category) {
            return _this.category.data.parent == category.id;
        })[0];
        if (listener) {
            listener();
        }
        listener = $scope.$watch(function () {
            return _this.category.parent;
        }, function (oldValue, newValue) {
            if (oldValue != newValue) {
                _this.category.data.parent = _this.category.parent.id;
                treefy();
            }
        });
        _this.parents = _this.categories.filter(function (category) {
            return !category.new_item && category.id != _this.category.data.id;
        });
    };

    this.get_categories();
} /* global root */

;

controller.$inject = ['$scope', '$http', 'notifications', 'gettextCatalog'];

exports.default = controller;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(28);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./categoryPanel.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./categoryPanel.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "panel[name=\"categories\"] .panel .editor.input-group {\n    height: calc(100% - 54px - 54px - 54px);\n}\n\npanel[name=\"categories\"] nav li > span {\n    padding: 3px 4px;\n    display: block;\n}\npanel[name=\"categories\"] nav li.selected > span {\n    background-color: #222d32;\n    color: white;\n}\npanel[name=\"categories\"] nav li.selected > i,\npanel[name=\"categories\"] nav li.selected > .wrapper a {\n    color: white;\n}\npanel[name=\"categories\"] nav li ul {\n    margin-left: 20px;\n    width: calc(100% - 20px);\n}\npanel[name=\"categories\"] nav i::before {\n    content: \"\\F147\";\n}\npanel[name=\"categories\"] nav i.collapsed::before {\n    content: \"\\F196\";\n}\npanel[name=\"categories\"] nav i.collapsed ~ ul {\n    display: none;\n}\npanel[name=\"categories\"] nav i {\n    float: left;\n    margin: 6px;\n    position: relative;\n    z-index: 100;\n}\npanel[name=\"categories\"] .wrapper {\n    position: relative;\n}\npanel[name=\"categories\"] .wrapper > a {\n    position: absolute;\n    right: 8px;\n}\n", ""]);

// exports


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _panelTemplate = __webpack_require__(30);

var _panelTemplate2 = _interopRequireDefault(_panelTemplate);

var _panel = __webpack_require__(31);

var _panel2 = _interopRequireDefault(_panel);

__webpack_require__(32);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    replace: true,
    bindings: {
        name: '@'
    },
    require: {
        main: '^ngController'
    },
    transclude: true,
    controller: _panel2.default,
    template: _panelTemplate2.default,
    controllerAs: 'ctrl'
};

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = "<div class=\"panel\" ng-if=\"ctrl.main.panel == ctrl.name\" ng-transclude></div>\n";

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {};

;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(33);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./panel.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./panel.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".panel {\n    padding: 10px;\n}\npanel.split nav {\n    float: left;\n    width: 200px;\n    height: 100%;\n    overflow: auto;\n    marin-right: 10px;\n}\npanel.split nav ul {\n    list-style: none;\n    padding: 0;\n    margin: 0;\n}\npanel.split nav li {\n    position: relative;\n}\nnav.selectable-list .selected a {\n    background-color: #222d32;\n    color: white;\n}\nnav.selectable-list a:first-child {\n    display: block;\n}\nnav.selectable-list a {\n    padding: 2px 6px;\n    cursor: pointer;\n}\nnav.selectable-list a:nth-child(2) {\n    position: absolute;\n    right: 6px;\n    top: 0;\n}\nnav.selectable-list .selected a:nth-child(2) {\n    color: white;\n}\npanel.split .right, panel.split .right.input-group > input {\n    float: right;\n}\npanel.split .panel > .right {\n    width: calc(100% - 200px);\n}\npanel.split .panel > .right, panel.split .panel form, panel.split .mce-tinymce {\n    height: 100%;\n}\npanel.split .input-group {\n    padding: 10px;\n    width: 100%;\n}\n/*Container, container body, iframe*/\n.mce-tinymce, .mce-container-body, #code_ifr {\n    min-height: 100% !important;\n}\n/*Container body*/\n.mce-container-body {\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    right: 0;\n}\n/*Editing area*/\n.mce-container-body .mce-edit-area {\n    position: absolute;\n    top: 69px;\n    bottom: 37px;\n    left: 0;\n    right: 0;\n}\n/*Footer*/\n.mce-tinymce .mce-statusbar {\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    right: 0;\n}\n", ""]);

// exports


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _treeViewTemplate = __webpack_require__(35);

var _treeViewTemplate2 = _interopRequireDefault(_treeViewTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    bindings: {
        'click_item': '&click',
        'delete_item': '&delete'
    },
    require: {
        ngModel: '^ngModel'
    },
    controller: function controller() {
        var _this = this;

        this.$onInit = function () {
            _this.ngModel.$render = function () {
                _this.tree = _this.ngModel.$viewValue;
            };
        };
    },
    controllerAs: 'ctrl',
    template: _treeViewTemplate2.default
};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/ng-template\"  id=\"tree_partial.html\">\n  <i ng-click=\"node.collapsed = !node.collapsed\" ng-show=\"node.nodes.length\"\n     class=\"fa\" ng-class=\"{collapsed: node.collapsed}\"></i>\n  <span class=\"wrapper\">\n    <span ng-click=\"ctrl.click_item({node})\">{{node.data.name}}</span>\n    <a ng-click=\"ctrl.delete_item({node})\">x</a>\n  </span>\n  <ul>\n    <li ng-repeat=\"node in node.nodes\" ng-include=\"'tree_partial.html'\" ng-class=\"node.class\"></li>\n  </ul>\n</script>\n<ul>\n  <li ng-repeat=\"node in ctrl.tree\" ng-include=\"'tree_partial.html'\" ng-class=\"node.class\"></li>\n</ul>\n";

/***/ }),
/* 36 */,
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _validateMatch = __webpack_require__(38);

var _validateMatch2 = _interopRequireDefault(_validateMatch);

var _imagePicker = __webpack_require__(39);

var _imagePicker2 = _interopRequireDefault(_imagePicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global angular */

exports.default = angular.module('directives', []).directive('validateMatch', _validateMatch2.default).directive('imagePicker', _imagePicker2.default);

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateMatch;
/**
 * Validator for matching two inputs.
 * The given attribute is the value to match the own modelValue.
 * @example
 *   <input name="passwordConfirm" type="password" ng-model="passwordConf" validate-match="newPassword">
 */
function validateMatch() {
  return {
    require: 'ngModel',
    scope: {
      validateMatch: '='
    },
    link: function link(scope, element, attrs, ngModel) {

      scope.$watch('validateMatch', function () {
        ngModel.$validate(); // validate again when match value changes
      });

      ngModel.$validators.notMatch = function (modelValue) {
        if (!modelValue || !scope.validateMatch || ngModel.$error.minlength) {
          return true;
        }
        return modelValue === scope.validateMatch;
      };
    }
  };
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _imagePickerTemplate = __webpack_require__(40);

var _imagePickerTemplate2 = _interopRequireDefault(_imagePickerTemplate);

__webpack_require__(41);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global Image, FileReader */

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
        template: _imagePickerTemplate2.default,
        link: function link($scope, $element, $atts, ngModelController) {
            $scope.root = root;
            var newImage = function newImage(file, path) {
                var same = $scope.images.filter(function (image) {
                    return image.name == file.name;
                });
                if (file.name.match(/(jpe?g|gif|png)$/i) && !same.length) {
                    var reader = new FileReader();
                    var readImage = function readImage() {
                        reader.onload = function (e) {
                            var image = new Image();
                            image.src = e.target.result;
                            image.onload = function () {
                                $scope.$apply(function () {
                                    $scope.images.unshift({
                                        src: scaleImage(image, $scope.size),
                                        name: file.name
                                    });
                                });
                            };
                        };
                        reader.readAsDataURL(file);
                    };
                    var ret = $scope.upload({ file: file, path: path });
                    if (ret && ret.then) {
                        ret.then(readImage);
                    } else {
                        readImage();
                    }
                }
            };
            $element.on('dragover', function (event) {
                if (event.originalEvent) {
                    event = event.originalEvent;
                }
                event.dataTransfer.dropEffect = "move";
                return false;
            }).on('drop', function (event) {
                event.preventDefault();
                fileDropHandler(event, $scope.path, newImage);
            });
            var $file = $element.find('.file input').on('change', function (e) {
                newImage(e.target.files[0], $scope.path);
            });
            $scope.top = $element.find('[ng-transclude]').height();
            $scope.$on('$destroy', function () {
                $element.off('drop dragover');
                $file.off('change');
            });
            $scope.select = function (image) {
                $scope.selected = image;
                $scope.expanded = false;
                if (ngModelController) {
                    ngModelController.$setViewValue(image.name);
                }
            };
            $scope.search = function () {
                if ($scope.searchTerm) {
                    var re = new RegExp($scope.searchTerm, 'i');
                    $scope.filteredImages = $scope.images.filter(function (image) {
                        return image.name.match(re);
                    });
                } else {
                    $scope.filteredImages = $scope.images;
                }
            };
            function select(viewValue) {
                $scope.images.forEach(function (image) {
                    if (viewValue == image.name) {
                        $scope.selected = image;
                    }
                });
            }
            $scope.pageSize = $scope.pageSize || 4;
            $scope.page = 1;
            $scope.filteredImages = $scope.images;
            $scope.$watch(function () {
                return [$scope.filteredImages, $scope.page];
            }, function (newValue, oldValue) {
                var start = ($scope.page - 1) * $scope.pageSize;
                var end = $scope.page * $scope.pageSize;
                $scope.pageImages = $scope.filteredImages.slice(start, end);
            }, true);
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
            ngModelController.$render = function () {
                if (ngModelController.$viewValue) {
                    select(ngModelController.$viewValue);
                }
            };
        }
    };
}

imagePickerDirective.$inject = ['fileDropHandler', 'scaleImage', 'root', 'api'];

exports.default = imagePickerDirective;

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = "<div class=\"image-picker\">\n  <div ng-transclude ng-click=\"expanded=!expanded\"></div>\n  <div class=\"dropdown\" ng-show=\"expanded\" ng-style=\"{top: top}\">\n    <div class=\"controls\">\n      <div class=\"search input-group\">\n        <label class=\"input-group-addon\" for=\"searchTerm\" translate>filter</label>\n        <input class=\"form-control\" id=\"searchTerm\" ng-model=\"searchTerm\"\n               ng-keyup=\"search()\"/>\n      </div>\n      <div class=\"file btn btn-default\">\n        <p translate>upload new</p>\n        <input type=\"file\" />\n      </div>\n      <div class=\"pages\">\n        <ul uib-pagination total-items=\"filteredImages.length\" ng-model=\"page\"\n            max-size=\"5\" items-per-page=\"pageSize\" class=\"pagination-sm\"\n            previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\"\n            ng-show=\"filteredImages.length > pageSize\"></ul>\n      </div>\n    </div>\n    <ul class=\"images\" >\n      <li ng-repeat=\"image in pageImages\" ng-class=\"{selected: image == selected}\"\n          ng-click=\"select(image)\" ng-hide=\"image.excluded\">\n        <span class=\"image\">\n          <img ng-src=\"{{image.src}}\" ng-if=\"image.src\" />\n          <img ng-src=\"{{root}}/image/{{size}}/{{image.name}}\" ng-if=\"!image.src\" />\n        </span>\n        <span class=\"image-label\">\n          {{image.name}}\n        </span>\n      </li>\n    </ul>\n  </div>\n</div>\n";

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(42);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./imagePicker.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./imagePicker.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".image-picker {\n    position: relative;\n}\n.image-picker [ng-transclude] {\n    overflow: hidden;\n}\n.image-picker .dropdown {\n    position: absolute;\n    z-index: 1000;\n    width: 100%;\n    background: white;\n    border: 1px solid #ccc;\n    border-top: none;\n}\n.image-picker .pages {\n    text-align: center;\n}\n.image-picker .pages ul {\n    margin: 10px 0 0;\n    display: inline-block;\n}\n.image-picker ul.images {\n    padding: 0;\n    list-style: none;\n    max-height: calc(4 * 70px);\n    overflow-y: scroll;\n    clear: both;\n}\n.image-picker .images li {\n    padding: 10px;\n    clear: both;\n    float: left;\n    width: 100%;\n    height: 70px;\n    cursor: pointer;\n}\n.image-picker .images li.selected {\n    background-color: #eee;\n    border: 1px solid #ccc;\n    border-left: none;\n    border-right: none;\n}\n.image-picker .images li:hover {\n    background-color: #eee;\n}\n.image-picker .controls {\n    padding: 10px;\n    float: left;\n    width: 100%;\n    clear: both;\n}\n.image-picker .controls .search {\n    float: left;\n    width: 60%;\n    padding: 0;\n    padding-right: 15px;\n}\n.image-picker .controls .search input,\n.image-picker .controls .search label {\n    height: 32px;\n}\n.image-picker .controls .file {\n    float: left;\n    width: 40%;\n    position: relative;\n    padding: 5px 10px;\n    overflow: hidden;\n}\n.image-picker .file p {\n    margin: 0;\n}\n.image-picker .file input {\n    position: absolute;\n    left: 0;\n    top: 0;\n    font-size: 99em;\n    opacity: 0;\n}\n", ""]);

// exports


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = __webpack_require__(3);

var _angular2 = _interopRequireDefault(_angular);

var _api = __webpack_require__(44);

var _api2 = _interopRequireDefault(_api);

var _fileDropHandler = __webpack_require__(45);

var _fileDropHandler2 = _interopRequireDefault(_fileDropHandler);

var _scaleImage = __webpack_require__(46);

var _scaleImage2 = _interopRequireDefault(_scaleImage);

var _popups = __webpack_require__(47);

var _popups2 = _interopRequireDefault(_popups);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('services', []).factory('api', _api2.default).factory('fileDropHandler', _fileDropHandler2.default).factory('scaleImage', _scaleImage2.default).factory('popups', _popups2.default);

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function api($http, root) {
    var data = function data(response) {
        return response.data;
    };
    function update_url(url, args) {
        if (args.length) {
            var i = 0;
            return url.replace(/\{([^}]+)\}/g, function (_, name) {
                return args[i++];
            });
        }
        return url;
    }
    function make_post_fn(url, type) {
        var headers = {};
        if (type != 'json') {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        return function (post_data) {
            return $http({
                method: 'POST',
                url: root + url,
                data: type == 'json' ? post_data : _jquery2.default.param(post_data),
                headers: headers
            }).then(data);
        };
    }
    function make_delete_fn(url) {
        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return $http({
                method: 'DELETE',
                url: root + update_url(url, args)
            }).then(data);
        };
    }
    function make_get_fn(url) {
        return function () {
            return $http({
                method: 'GET',
                url: root + url
            }).then(data);
        };
    }
    return {
        products: {
            post: make_post_fn('/api/product/'),
            list: make_get_fn('/api/product/list'),
            delete: make_delete_fn('/api/product/{id}')
        },
        pages: {
            post: make_post_fn('/api/page/'),
            list: make_get_fn('/api/page/list'),
            delete: make_delete_fn('/api/page/{id}')
        },
        categories: {
            post: make_post_fn('/api/category/'),
            list: make_get_fn('/api/category/list')
        },
        images: {
            list: make_get_fn('/api/images'),
            upload: function upload(file) {
                var data = new FormData();
                data.append('file', file);
                return $http({
                    method: 'POST',
                    url: root + '/upload',
                    data: data,
                    headers: {
                        'Content-Type': undefined
                    }
                });
            }
        }
    };
} /* global FormData */


api.$inject = ['$http', 'root'];

exports.default = api;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
function fileDropHandler($q) {
    function process(event, path, upload_file) {
        var defered = $q.defer();
        var self = this;
        if (event.originalEvent) {
            event = event.originalEvent;
        }
        var items;
        if (event.dataTransfer.items) {
            items = [].slice.call(event.dataTransfer.items);
        }
        var files = event.dataTransfer.files || event.target.files;
        if (files) {
            files = [].slice.call(files);
        }
        if (items && items.length) {
            if (items[0].webkitGetAsEntry) {
                var entries = [];
                items.forEach(function (item) {
                    var entry = item.webkitGetAsEntry();
                    if (entry) {
                        entries.push(entry);
                    }
                });
                (function upload() {
                    var entry = entries.shift();
                    if (entry) {
                        upload_tree(entry, path, upload_file).then(upload);
                    } else {
                        defered.resolve();
                    }
                })();
            }
        } else if (files && files.length) {
            (function upload() {
                var file = files.shift();
                if (file) {
                    upload_file(file, path).then(upload);
                } else {
                    defered.resolve();
                }
            })();
        } else if (event.dataTransfer.getFilesAndDirectories) {
            event.dataTransfer.getFilesAndDirectories().then(function (items) {
                (function upload() {
                    var item = items.shift();
                    if (item) {
                        upload_tree(item, path, upload_file).then(upload);
                    } else {
                        defered.resolve();
                    }
                })();
            });
        }
        return defered.promise;
    }
    function upload_tree(tree, path, file_upload_callback) {
        var defered = $q.defer();
        var self = this;
        function process(entries, callback) {
            entries = entries.slice();
            (function recur() {
                var entry = entries.shift();
                if (entry) {
                    callback(entry).then(recur).fail(function () {
                        defered.reject();
                    });
                } else {
                    defered.resolve();
                }
            })();
        }
        function upload_files(entries) {
            process(entries, function (entry) {
                return upload_tree(entry, path + '/' + tree.name);
            });
        }
        function upload_file(file) {
            var ret = file_upload_callback(file, path);
            if (ret && ret.then) {
                ret.then(function () {
                    defered.resolve();
                }).fail(function () {
                    defered.reject();
                });
            } else {
                defered.resolve();
            }
        }
        if (typeof Directory != 'undefined' && tree instanceof Directory) {
            // firefox
            tree.getFilesAndDirectories().then(function (entries) {
                upload_files(entries);
            });
        } else if (typeof File != 'undefined' && tree instanceof File) {
            // firefox
            upload_file(tree);
        } else if (tree.isFile) {
            // chrome
            tree.file(upload_file);
        } else if (tree.isDirectory) {
            // chrome
            var dirReader = tree.createReader();
            dirReader.readEntries(function (entries) {
                upload_files(entries);
            });
        }
        return defered.promise;
    }
    function is_file_drop(event) {
        if (event.originalEvent) {
            event = event.originalEvent;
        }
        if (event.dataTransfer.items && event.dataTransfer.items.length) {
            return !![].filter.call(event.dataTransfer.items, function (item) {
                return item.kind == 'file';
            }).length;
        } else {
            return event.dataTransfer.files && event.dataTransfer.files.length;
        }
    }
    return function (event, path, callback) {
        if (is_file_drop(event)) {
            return process(event, path, callback);
        } else {
            return $q.resolve();
        }
    };
}

fileDropHandler.$inject = ['$q'];

exports.default = fileDropHandler;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return scaleImage;
};

function scaleImage(image, size) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width, height;
    if (image.width > image.height) {
        width = size;
        height = image.height * (size / image.width);
    } else {
        height = size;
        width = image.width * (size / image.height);
    }
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL();
}

;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function popups($uibModal, $q, notifications, gettextCatalog) {
    var result = {};
    Object.keys(notifications).forEach(function (key) {
        if (key.match(/^show/)) {
            result[key] = function (options) {
                options = _jquery2.default.extend({}, options, {
                    message: gettextCatalog.getString(options.message)
                });
                return notifications[key](options);
            };
        } else {
            result[key] = notifications[key].bind(notifications);
        }
    });
    result['prompt'] = function (options) {
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
            template: '<div class="modal-header">\n               <h3 class="modal-title" id="modal-title">{{$ctrl.title}}</h3>\n            </div>\n            <div class="modal-body" id="modal-body">\n               {{$ctrl.message}}\n            </div>\n            <div class="modal-footer">\n               <button class="btn {{$ctrl.options.buttons.ok.class}}" type="button"\n                       ng-click="$ctrl.ok()">\n                 {{$ctrl.options.buttons.ok.text | translate}}\n               </button>\n               <button class="btn {{$ctrl.options.buttons.cancel.class}}" type="button"\n                       ng-click="$ctrl.cancel()">\n                 {{$ctrl.options.buttons.cancel.text | translate}}\n               </button>\n            </div>',
            controller: function controller() {
                this.options = options;
                this.title = gettextCatalog.getString(options.title);
                this.message = gettextCatalog.getString(options.message);
                this.ok = function () {
                    modalInstance.close();
                    defer.resolve();
                };
                this.cancel = function () {
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

exports.default = popups;

/***/ }),
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(60);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./app.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./app.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body {\n    margin: 0;\n    height: 100vh;\n}\n.error {\n    color: #a94442; /* same as boostrap */\n}\nheader.main, nav.left, footer {\n    font-family: sans-serif;\n}\nheader.main {\n    background-color: #3c8dbc;\n    color: #fff;\n}\nheader.main h1 {\n    height: 50px;\n    width: 100%;\n    display: table;\n    margin: 0;\n}\nheader.main .right {\n    display: table-cell;\n    width: calc(100% - 230px);\n    font-size: 14px;\n    font-weight: normal;\n    vertical-align: middle;\n}\nheader.main ul {\n    list-style: none;\n    margin: 0;\n    padding: 0;\n}\nheader.main li {\n    float: right;\n    margin: 10px;\n}\nheader.main li a, header li a:visited {\n    color: white;\n    text-decoration: none;\n}\nheader li a:hover {\n    text-decoration: underline;\n}\nheader .logo {\n    display: table-cell;\n    vertical-align: middle;\n    background-color: #367fa9;\n    text-align: center;\n    font-family: sans-serif;\n    font-weight: normal;\n    font-size: 20px;\n}\n.notifications .close-click {\n    position: relative;\n    top: -2px;\n}\nheader .logo, nav.left {\n    width: 230px;\n    color: white;\n}\nnav.left {\n    background-color: #222d32;\n    font-size: 14px;\n}\nnav.left, main {\n    height: calc(100% - 50px - 20px);\n}\nnav.left ul {\n    list-style: none;\n    margin: 0;\n    padding: 0;\n}\nnav.left li {\n    display: table;\n    height: 30px;\n    width: 100%;\n}\nnav.left a {\n    width: 100%;\n    height: 100%;\n    display: table-cell;\n    vertical-align: middle;\n    padding-left: 20px;\n}\nnav.left li a, nav.left li a:visited {\n    color: white;\n}\nnav.left li.selected a {\n    border-left: 4px solid #367fa9;\n}\nnav.left li.selected a {\n    padding-left: 16px;\n}\nfooter a, footer a:visited, nav.left li a, nav.left li a:visited {\n    text-decoration: none;\n    cursor: pointer;\n}\nnav.left li:hover a {\n    background: #1e282c;\n}\nmain {\n    position: absolute;\n    left: 230px;\n    width: calc(100% - 230px);\n    top: 50px;\n    overflow: auto;\n}\nmain .panel {\n    display: block;\n    height: calc(100vh - 50px - 20px);\n    overflow: auto;\n    margin: 0;\n}\n.mce-container-body .mce-edit-area {\n    top: 40px;\n}\nfooter {\n    height: 20px;\n    box-sizing: border-box;\n    margin: 0;\n    font-size: 12px;\n    background: black;\n    color: white;\n    text-align: center;\n    padding: 3px 0;\n}\nfooter p {\n    margin: 0;\n}\nfooter a, footer a:visited {\n    color: white;\n}\nfooter a:hover {\n    text-decoration: underline;\n}\n", ""]);

// exports


/***/ })
],[5]);