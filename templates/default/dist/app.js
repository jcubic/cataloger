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

var _directives = __webpack_require__(35);

var _directives2 = _interopRequireDefault(_directives);

__webpack_require__(37);

var _angularGettext = __webpack_require__(43);

var _angularGettext2 = _interopRequireDefault(_angularGettext);

__webpack_require__(45);

__webpack_require__(46);

__webpack_require__(48);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = _angular2.default.module('app', ['ngNotificationsBar', _angularGettext2.default, _components2.default.name, _directives2.default.name]); /* global location, $, root */

app.factory('config', ['$http', '$location', function ($http, $location) {
    var lang = $location.search()['lang'];
    var query = lang ? '?lang=' + lang : '';
    return $http.get(root + '/api/config' + query).then(function (response) {
        return response.data;
    });
}]);

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

app.controller('main', function ($scope) {
    var _this = this;

    var set = function set() {
        _this.panel = location.hash.replace(/^#/, '');
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

var _settingsPanel = __webpack_require__(13);

var _settingsPanel2 = _interopRequireDefault(_settingsPanel);

var _pagePanel = __webpack_require__(16);

var _pagePanel2 = _interopRequireDefault(_pagePanel);

var _categoryPanel = __webpack_require__(22);

var _categoryPanel2 = _interopRequireDefault(_categoryPanel);

var _panel = __webpack_require__(27);

var _panel2 = _interopRequireDefault(_panel);

var _treeView = __webpack_require__(32);

var _treeView2 = _interopRequireDefault(_treeView);

__webpack_require__(34);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    template: _productPanelTemplate2.default,
    controller: _productPanel2.default,
    controllerAs: 'ctrl'
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "<panel name=\"products\">\n  <nav>\n    <ul>\n      <li ng-repeat=\"product in ctrl.products track by $index\">{{product.name}}</li>\n    </ul>\n  </nav>\n  <div class=\"left\">\n  </div>\n</panel>\n";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/* global root */

function controller($http) {
    var _this = this;

    this.products = [];
    var get = function get(url, variable) {
        $http({ method: 'GET', url: root + url }).then(function (response) {
            _this[variable] = response.data;
        });
    };
    this.get_categories = function () {
        get('/api/category/list', 'categories');
    };
    this.get_products = function () {
        get('/api/product/list', 'products');
    };
    this.new_product = function () {
        $http({
            method: 'POST',
            url: root + '/api/product/new',
            data: {
                name: _this.name,
                price: _this.price || null,
                category: _this.category
            }
        }).then(function (response) {
            if (response.result) {
                _this.get_products();
            }
        });
    };
    this.get_products();
    this.get_categories();
};

controller.$inject = ['$http'];

exports.default = controller;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _settingsPanelTemplate = __webpack_require__(14);

var _settingsPanelTemplate2 = _interopRequireDefault(_settingsPanelTemplate);

var _settingsPanel = __webpack_require__(15);

var _settingsPanel2 = _interopRequireDefault(_settingsPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    template: _settingsPanelTemplate2.default,
    controller: _settingsPanel2.default,
    controllerAs: 'ctrl'
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "<panel name=\"settings\">\n  <div>\n    <header><h2 translate>password</h2></header>\n    <form id=\"password\" name=\"password\">\n      <div class=\"form-group\">\n        <label class=\"control-label\" for=\"old_password\" translate>old password</label>\n        <input class=\"form-control\" id=\"old_password\" type=\"password\" ng-model=\"ctrl.password.old\" />\n      </div>\n      <div class=\"form-group\">\n        <label class=\"control-label\" for=\"new_password\" translate>new password</label>\n        <input class=\"form-control\" id=\"new_password\" type=\"password\" name=\"new_password\"\n               ng-model=\"ctrl.password.new\" />\n      </div>\n      <div class=\"form-group\" ng-class=\"{'has-error': password.confirm_password.$error.notMatch}\">\n        <label class=\"control-label\" for=\"confirm_password\" type=\"password\" translate>confirm password</label>\n        <input class=\"form-control\" id=\"confirm_password\" name=\"confirm_password\" type=\"password\"\n               ng-model=\"ctrl.password.confirm\" validate-match=\"ctrl.password.new\" />\n        <p ng-show=\"password.confirm_password.$error.notMatch\" class=\"error\" translate>passwords do not match</span>\n      </div>\n    </form>\n  </div>\n  <button class=\"btn btn-default\" ng-click=\"ctrl.save()\" translate>save</button>\n</panel>\n";

/***/ }),
/* 15 */
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _pagePanelTemplate = __webpack_require__(17);

var _pagePanelTemplate2 = _interopRequireDefault(_pagePanelTemplate);

var _pagePanel = __webpack_require__(18);

var _pagePanel2 = _interopRequireDefault(_pagePanel);

__webpack_require__(19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    template: _pagePanelTemplate2.default,
    controller: _pagePanel2.default,
    controllerAs: 'ctrl'
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "<panel name=\"pages\" class=\"split\">\n  <nav>\n    <ul>\n      <li><a ng-click=\"ctrl.new_page()\" translate>new page</a></li>\n      <li ng-repeat=\"page in ctrl.pages track by $index\"\n          ng-class=\"{selected: page == ctrl.page}\">\n        <a ng-click=\"ctrl.view(page)\">{{page.title}}</a>\n        <a ng-click=\"ctrl.delete_page($index)\">x</a>\n      </li>\n    </ul>\n  </nav>\n  <div class=\"right\" ng-if=\"ctrl.page\">\n    <form name=\"page\">\n      <div class=\"input-group\">\n        <label class=\"input-group-addon\" for=\"title\" translate>title</label>\n        <input class=\"form-control\" id=\"title\" ng-model=\"ctrl.page.title\"/>\n      </div>\n      <div class=\"input-group editor\">\n        <textarea ui-tinymce=\"ctrl.tinymce_options\" class=\"form-control\" ng-model=\"ctrl.page.content\"></textarea>\n      </div>\n      <div class=\"right input-group\">\n        <input class=\"btn btn-default\" type=\"button\" ng-value=\"'save' | translate\" ng-click=\"ctrl.save()\" />\n      </div>\n    </form>\n  </div>\n</panel>\n";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function controller($http, notifications, gettextCatalog) {
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
    this.products = [];
    var get = function get(url, variable) {
        $http({ method: 'GET', url: root + url }).then(function (response) {
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
    this.get_pages = function () {
        get('/api/page/list', 'pages');
    };
    var new_page = function new_page() {
        var title = _this.page.title;
        post({
            url: '/api/page/',
            data: {
                title: title,
                content: _this.page.content
            }
        }).then(function (data) {
            if (data.result !== false) {
                _this.pages.forEach(function (page) {
                    if (page.title == title) {
                        page.id = data.result[0];
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
            url: '/api/page/',
            data: {
                id: _this.page.id,
                title: _this.page.title,
                content: _this.page.content
            }
        }).then(function (data) {
            if (data.result) {
                notifications.showSuccess({
                    message: gettextCatalog.getString('Save successfull')
                });
            }
        });
    };
    this.delete_page = function (index) {
        var page = _this.pages[index];
        var id = page.id;
        if (typeof id === 'undefined') {
            var title = page.title;
            _this.pages = _this.pages.filter(function (page) {
                return page.title != title;
            });
        } else {
            $http({
                method: 'DELETE',
                url: root + '/api/page/' + id
            }).then(function (response) {
                if (response.data.result) {
                    _this.pages = _this.pages.filter(function (page) {
                        return page.id != id;
                    });
                }
            });
        }
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

controller.$inject = ['$http', 'notifications', 'gettextCatalog'];

exports.default = controller;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "panel[name=\"pages\"] nav .selected a {\n    background-color: #222d32;\n    color: white;\n}\npanel[name=\"pages\"] nav a:first-child {\n    display: block;\n}\npanel[name=\"pages\"] nav a {\n    padding: 2px 6px;\n    cursor: pointer;\n}\npanel[name=\"pages\"] nav a:nth-child(2) {\n    position: absolute;\n    right: 6px;\n    top: 0;\n}\npanel[name=\"pages\"] nav .selected a:nth-child(2) {\n    color: white;\n}\npanel[name=\"pages\"] .panel .editor.input-group {\n    height: calc(100% - 54px - 54px);\n}\n", ""]);

// exports


/***/ }),
/* 21 */,
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _categoryPanelTemplate = __webpack_require__(23);

var _categoryPanelTemplate2 = _interopRequireDefault(_categoryPanelTemplate);

var _categoryPanel = __webpack_require__(24);

var _categoryPanel2 = _interopRequireDefault(_categoryPanel);

__webpack_require__(25);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    template: _categoryPanelTemplate2.default,
    controller: _categoryPanel2.default,
    controllerAs: 'ctrl'
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "<panel name=\"categories\" class=\"split\">\n  <nav>\n    <a ng-click=\"ctrl.new_category()\" translate>new category</a>\n    <tree-view ng-model=\"ctrl.tree\" click=\"ctrl.view(node)\" delete=\"ctrl.delete(node)\"></tree-view>\n  </nav>\n  <div class=\"right\" ng-if=\"ctrl.category\">\n    <form name=\"category\">\n      <div class=\"input-group\">\n        <label class=\"input-group-addon\" for=\"name\" translate>name</label>\n        <input class=\"form-control\" id=\"name\" ng-model=\"ctrl.category.data.name\"/>\n      </div>\n      <div class=\"input-group\" ng-if=\"ctrl.parents.length\" >\n        <label class=\"input-group-addon\" for=\"parent\" translate>parent category</label>\n        <select ng-options=\"item as item.name for item in ctrl.parents track by item.id\"\n                ng-model=\"ctrl.category.parent\" class=\"form-control\"></select>\n      </div>\n      <div class=\"input-group editor\">\n        <textarea ui-tinymce=\"ctrl.tinymce_options\" class=\"form-control\" ng-model=\"ctrl.category.data.content\">\n        </textarea>\n      </div>\n      <div class=\"right input-group\">\n        <input class=\"btn btn-default\" type=\"button\" ng-value=\"'save' | translate\" ng-click=\"ctrl.save()\" />\n      </div>\n    </form>\n  </div>\n</panel>\n";

/***/ }),
/* 24 */
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "panel[name=\"categories\"] .panel .editor.input-group {\n    height: calc(100% - 54px - 54px - 54px);\n}\n\npanel[name=\"categories\"] nav li > span {\n    padding: 3px 4px;\n    display: block;\n}\npanel[name=\"categories\"] nav li.selected > span {\n    background-color: #222d32;\n    color: white;\n}\npanel[name=\"categories\"] nav li.selected > i,\npanel[name=\"categories\"] nav li.selected > .wrapper a {\n    color: white;\n}\npanel[name=\"categories\"] nav li ul {\n    margin-left: 20px;\n    width: calc(100% - 20px);\n}\npanel[name=\"categories\"] nav i::before {\n    content: \"\\F147\";\n}\npanel[name=\"categories\"] nav i.collapsed::before {\n    content: \"\\F196\";\n}\npanel[name=\"categories\"] nav i.collapsed ~ ul {\n    display: none;\n}\npanel[name=\"categories\"] nav i {\n    float: left;\n    margin: 6px;\n    position: relative;\n    z-index: 100;\n}\npanel[name=\"categories\"] .wrapper {\n    position: relative;\n}\npanel[name=\"categories\"] .wrapper > a {\n    position: absolute;\n    right: 8px;\n}\n", ""]);

// exports


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _panelTemplate = __webpack_require__(28);

var _panelTemplate2 = _interopRequireDefault(_panelTemplate);

var _panel = __webpack_require__(29);

var _panel2 = _interopRequireDefault(_panel);

__webpack_require__(30);

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
/* 28 */
/***/ (function(module, exports) {

module.exports = "<div class=\"panel\" ng-show=\"ctrl.main.panel == ctrl.name\" ng-transclude></div>\n";

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {};

;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(31);
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
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".panel {\n    padding: 10px;\n}\npanel.split nav {\n    float: left;\n    width: 200px;\n    height: 100%;\n    overflow: auto;\n    marin-right: 10px;\n}\npanel.split nav ul {\n    list-style: none;\n    padding: 0;\n    margin: 0;\n}\npanel.split nav li {\n    position: relative;\n}\npanel.split .right, panel.split .right.input-group > input {\n    float: right;\n}\npanel.split .panel > .right {\n    width: calc(100% - 200px);\n}\npanel.split .panel > .right, panel.split .panel form, panel.split .mce-tinymce {\n    height: 100%;\n}\npanel.split .input-group {\n    padding: 10px;\n    width: 100%;\n}\n/*Container, container body, iframe*/\n.mce-tinymce, .mce-container-body, #code_ifr {\n    min-height: 100% !important;\n}\n/*Container body*/\n.mce-container-body {\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    right: 0;\n}\n/*Editing area*/\n.mce-container-body .mce-edit-area {\n    position: absolute;\n    top: 69px;\n    bottom: 37px;\n    left: 0;\n    right: 0;\n}\n/*Footer*/\n.mce-tinymce .mce-statusbar {\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    right: 0;\n}\n", ""]);

// exports


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _treeViewTemplate = __webpack_require__(33);

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
/* 33 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/ng-template\"  id=\"tree_partial.html\">\n  <i ng-click=\"node.collapsed = !node.collapsed\" ng-show=\"node.nodes.length\"\n     class=\"fa\" ng-class=\"{collapsed: node.collapsed}\"></i>\n  <span class=\"wrapper\">\n    <span ng-click=\"ctrl.click_item({node})\">{{node.data.name}}</span>\n    <a ng-click=\"ctrl.delete_item({node})\">x</a>\n  </span>\n  <ul>\n    <li ng-repeat=\"node in node.nodes\" ng-include=\"'tree_partial.html'\" ng-class=\"node.class\"></li>\n  </ul>\n</script>\n<ul>\n  <li ng-repeat=\"node in ctrl.tree\" ng-include=\"'tree_partial.html'\" ng-class=\"node.class\"></li>\n</ul>\n";

/***/ }),
/* 34 */,
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _validateMatch = __webpack_require__(36);

var _validateMatch2 = _interopRequireDefault(_validateMatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = angular.module('directives', []).directive('validateMatch', _validateMatch2.default); /* global angular */

/***/ }),
/* 36 */
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
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
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
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body {\n    margin: 0;\n    height: 100vh;\n}\n.error {\n    color: #a94442; /* same as boostrap */\n}\nheader.main, nav.left, footer {\n    font-family: sans-serif;\n}\nheader.main {\n    background-color: #3c8dbc;\n    color: #fff;\n}\nheader.main h1 {\n    height: 50px;\n    width: 100%;\n    display: table;\n    margin: 0;\n}\nheader.main .right {\n    display: table-cell;\n    width: calc(100% - 230px);\n    font-size: 14px;\n    font-weight: normal;\n    vertical-align: middle;\n}\nheader.main ul {\n    list-style: none;\n    margin: 0;\n    padding: 0;\n}\nheader.main li {\n    float: right;\n    margin: 10px;\n}\nheader.main li a, header li a:visited {\n    color: white;\n    text-decoration: none;\n}\nheader li a:hover {\n    text-decoration: underline;\n}\nheader .logo {\n    display: table-cell;\n    vertical-align: middle;\n    background-color: #367fa9;\n    text-align: center;\n    font-family: sans-serif;\n    font-weight: normal;\n    font-size: 20px;\n}\n.notifications .close-click {\n    position: relative;\n    top: -2px;\n}\nheader .logo, nav.left {\n    width: 230px;\n    color: white;\n}\nnav.left {\n    background-color: #222d32;\n    font-size: 14px;\n}\nnav.left, main {\n    height: calc(100% - 50px - 20px);\n}\nnav.left ul {\n    list-style: none;\n    margin: 0;\n    padding: 0;\n}\nnav.left li {\n    display: table;\n    height: 30px;\n    width: 100%;\n}\nnav.left a {\n    width: 100%;\n    height: 100%;\n    display: table-cell;\n    vertical-align: middle;\n    padding-left: 20px;\n}\nnav.left li a, nav.left li a:visited {\n    color: white;\n}\nnav.left li.selected a {\n    border-left: 4px solid #367fa9;\n}\nnav.left li.selected a {\n    padding-left: 16px;\n}\nfooter a, footer a:visited, nav.left li a, nav.left li a:visited {\n    text-decoration: none;\n    cursor: pointer;\n}\nnav.left li:hover a {\n    background: #1e282c;\n}\nmain {\n    position: absolute;\n    left: 230px;\n    width: calc(100% - 230px);\n    top: 50px;\n    overflow: auto;\n}\nmain .panel {\n    display: block;\n    height: calc(100vh - 50px - 20px);\n    margin: 0;\n}\n.mce-container-body .mce-edit-area {\n    top: 40px;\n}\nfooter {\n    height: 20px;\n    box-sizing: border-box;\n    margin: 0;\n    font-size: 12px;\n    background: black;\n    color: white;\n    text-align: center;\n    padding: 3px 0;\n}\nfooter p {\n    margin: 0;\n}\nfooter a, footer a:visited {\n    color: white;\n}\nfooter a:hover {\n    text-decoration: underline;\n}\n", ""]);

// exports


/***/ })
],[5]);