webpackJsonp([0],{

/***/ 100:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(101)(undefined);
// imports


// module
exports.push([module.i, "\nbody {\n    margin: 0;\n    height: 100vh;\n}\nheader, nav.left, footer {\n    font-family: sans-serif;\n}\nheader {\n    background-color: #3c8dbc;\n    color: #fff;\n}\nheader h1 {\n    height: 50px;\n    display: table;\n    margin: 0;\n}\nheader .logo {\n    display: table-cell;\n    vertical-align: middle;\n    background-color: #367fa9;\n    text-align: center;\n    font-family: sans-serif;\n    font-weight: normal;\n    font-size: 20px;\n}\nheader .logo, nav.left {\n    width: 230px;\n    color: white;\n}\nnav.left {\n    background-color: #222d32;\n    font-size: 14px;\n}\nnav.left, main {\n    height: calc(100% - 50px - 20px);\n}\nnav.left ul {\n    list-style: none;\n    margin: 0;\n    padding: 0;\n}\nnav.left li {\n    display: table;\n    height: 30px;\n    width: 100%;\n}\nnav.left a {\n    width: 100%;\n    height: 100%;\n    display: table-cell;\n    vertical-align: middle;\n    padding-left: 20px;\n}\nnav.left li a, nav.left li a:visited {\n    color: white;\n}\nnav.left li.selected a {\n    border-left: 4px solid #367fa9;\n}\nnav.left li.selected a {\n    padding-left: 16px;\n}\nfooter a, footer a:visited, nav.left li a, nav.left li a:visited {\n    text-decoration: none;\n    cursor: pointer;\n}\nnav.left li:hover a {\n    background: #1e282c;\n}\nmain {\n    position: absolute;\n    left: 230px;\n    width: calc(100% - 230px);\n    top: 50px;\n    overflow: auto;\n}\nfooter {\n    height: 20px;\n    box-sizing: border-box;\n    margin: 0;\n    font-size: 12px;\n    background: black;\n    color: white;\n    text-align: center;\n    padding: 3px 0;\n}\nfooter p {\n    margin: 0;\n}\nfooter a, footer a:visited {\n    color: white;\n}\nfooter a:hover {\n    text-decoration: underline;\n}\n", ""]);

// exports


/***/ }),

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(59);

var _jquery2 = _interopRequireDefault(_jquery);

var _angular = __webpack_require__(16);

var _angular2 = _interopRequireDefault(_angular);

var _angularjs = __webpack_require__(63);

var _angularjs2 = _interopRequireDefault(_angularjs);

var _components = __webpack_require__(92);

var _components2 = _interopRequireDefault(_components);

__webpack_require__(99);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = _angular2.default.module('app', [_angularjs2.default, _components2.default.name]); /* global location, $ */

app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
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

/***/ 92:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = __webpack_require__(16);

var _angular2 = _interopRequireDefault(_angular);

var _productPanel = __webpack_require__(93);

var _productPanel2 = _interopRequireDefault(_productPanel);

var _panel = __webpack_require__(96);

var _panel2 = _interopRequireDefault(_panel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('components', []).component('productPanel', _productPanel2.default).component('panel', _panel2.default);

/***/ }),

/***/ 93:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _productPanelTemplate = __webpack_require__(94);

var _productPanelTemplate2 = _interopRequireDefault(_productPanelTemplate);

var _productPanel = __webpack_require__(95);

var _productPanel2 = _interopRequireDefault(_productPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    template: _productPanelTemplate2.default,
    controller: _productPanel2.default,
    controllerAs: 'ctrl'
};

/***/ }),

/***/ 94:
/***/ (function(module, exports) {

module.exports = "<panel name=\"products\">\n  <nav>\n    <ul>\n      <li ng-repeat=\"product in ctrl.products track by $index\">{{product.name}}</li>\n    </ul>\n  </nav>\n  <div class=\"left\">\n    \n  </div>\n</panel>\n";

/***/ }),

/***/ 95:
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
};

controller.$inject = ['$http'];

exports.default = controller;

/***/ }),

/***/ 96:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _panelTemplate = __webpack_require__(97);

var _panelTemplate2 = _interopRequireDefault(_panelTemplate);

var _panel = __webpack_require__(98);

var _panel2 = _interopRequireDefault(_panel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
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

/***/ 97:
/***/ (function(module, exports) {

module.exports = "<div class=\"panel\" ng-show=\"ctrl.main.panel == ctrl.name\" ng-transclude></div>\n";

/***/ }),

/***/ 98:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {};

;

/***/ }),

/***/ 99:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(100);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(102)(content, options);
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

/***/ })

},[58]);