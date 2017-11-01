/* global root */

import $ from 'jquery';

function controller($scope, $http, notifications, gettextCatalog) {
    this.tinymce_options = {
        theme: 'modern',
        skin: 'lightgray',
        menubar: false,
        statusbar: false,
        height: '100%',
        plugins: [
            "advlist code"
        ],
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | preview fullpage | forecolor backcolor table | code"
    };
    this.categories = [];
    this.tree = [];
    let get = (url, variable) => {
        return $http({method: 'GET', url: root + url}).then((response) => {
            this[variable] = response.data;
        });
    };
    let post = (options) => $http({
        method: 'POST',
        url: root + options.url,
        data: $.param(options.data),
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    }).then((response) => response.data);
    function make_tree(array, fn, filter) {
        if (!filter) {
            filter = array.filter(function(item) {
                return !item.parent || item.parent == "0";
            });
        }
        if (!filter.length) {
            return [];
        }
        return filter.map(function(item) {
            return $.extend({
                nodes: make_tree(array, fn, array.filter(function(node) {
                    return node.parent == item.id;
                }))
            }, fn(item));
        });
    }
    let treefy = () => {
        this.tree = make_tree(this.categories, function(node) {
            return {
                name: node.name,
                data: node
            };
        });
    };
    this.get_categories = () => {
        get('/api/category/list', 'categories').then(treefy);
    };
    let new_category = () => {
        var name = this.category.data.name;
        post({
            url: '/api/category/',
            data: {
                name: name,
                content: this.category.data.content,
                parent: this.category.parent ? this.category.parent.id : null
            }
        }).then((data) => {
            if (data.result !== false) {
                this.categories.forEach(function(category) {
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
    let update = () => {
        post({
            url: '/api/category/',
            data: {
                id: this.category.data.id,
                name: this.category.data.name,
                content: this.category.data.content,
                parent: this.category.parent.id
            }
        }).then((data) => {
            if (data.result) {
                notifications.showSuccess({
                    message: gettextCatalog.getString('Save successfull')
                });
            }
        });
    };
    this.delete_category = (index) => {
        var category = this.categories[index];
        var id = category.id;
        if (typeof id === 'undefined' || typeof id == 'string' && id.match(/^new [0-9]+$/)) {
            var name = category.name;
            this.categories = this.categories.filter((category) => category.name != name);
        } else {
            $http({
                method: 'DELETE',
                url: root + '/api/page/' + id
            }).then((response) => {
                if (response.data.result) {
                    this.categories = this.categories.filter((category) => {
                        return category.id != id;
                    });
                }
            });
        }
    };
    this.save = () => {
        if (this.category.data.new_item) {
            new_category();
        } else {
            update();
        }
    };
    this.new_category = () => {
        var new_items = this.categories.filter((category) => category.new_item);
        var name = 'new ' + (new_items.length + 1);
        this.categories.push({
            name: name,
            id: name,
            content: '',
            new_item: true
        });
        treefy();
    };
    let listener;
    this.view = (category) => {
        if (this.category) {
            delete this.category.class;
        }
        this.category = category;
        this.category.class = 'selected';
        this.category.parent = this.categories.filter((category) => {
            return this.category.data.parent == category.id;
        })[0];
        if (listener) {
            listener();
        }
        listener = $scope.$watch(() => this.category.parent, (oldValue, newValue) => {
            if (oldValue != newValue) {
                this.category.data.parent = this.category.parent.id;
                treefy();
            }
        });
        this.parents = this.categories.filter((category) => {
            return !category.new_item && category.id != this.category.data.id;
        });
    };
    
    this.get_categories();
};

controller.$inject = ['$scope', '$http', 'notifications', 'gettextCatalog'];

export default controller;
