/* global root */

import $ from 'jquery';

function controller($http, notifications, gettextCatalog, editorOptions) {
    this.tinymce_options = editorOptions;
    this.products = [];
    let get = (url, variable) => {
        $http({method: 'GET', url: root + url}).then((response) => {
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
    this.get_pages = () => {
        get('/api/page/list', 'pages');
    };
    let new_page = () => {
        var title = this.page.title;
        post({
            url: '/api/page/',
            data: {
                title: title,
                content: this.page.content
            }
        }).then((data) => {
            if (data.result !== false) {
                this.pages.forEach(function(page) {
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
    let update = () => {
        post({
            url: '/api/page/',
            data: {
                id: this.page.id,
                title: this.page.title,
                content: this.page.content
            }
        }).then((data) => {
            if (data.result) {
                notifications.showSuccess({
                    message: gettextCatalog.getString('Save successfull')
                });
            }
        });
    };
    this.delete_page = (index) => {
        var page = this.pages[index];
        var id = page.id;
        if (typeof id === 'undefined') {
            var title = page.title;
            this.pages = this.pages.filter((page) => page.title != title);
        } else {
            $http({
                method: 'DELETE',
                url: root + '/api/page/' + id
            }).then((response) => {
                if (response.data.result) {
                    this.pages = this.pages.filter((page) => {
                        return page.id != id;
                    });
                }
            });
        }
    };
    this.save = () => {
        if (!this.page.id) {
            new_page();
        } else {
            update();
        }
    };
    
    this.new_page = () => {
        var untitled = this.pages.filter((page) => page.title.match(/^untitled/));
        this.pages.push({
            title: 'untitled ' + (untitled.length + 1),
            content: ''
        });
    };
    this.view = (page) => {
        this.page = page;
    };
    this.get_pages();
};

controller.$inject = ['$http', 'notifications', 'gettextCatalog', 'editorOptions'];

export default controller;
