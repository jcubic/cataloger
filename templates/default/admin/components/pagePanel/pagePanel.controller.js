/* global root */

import $ from 'jquery';

function controller($http, translatedNotifications, editorOptions, api) {
    this.tinymce_options = editorOptions;
    this.products = [];
    let get = (url, variable) => {
        api.pages.list().then((data) => this[variable] = data);
    };
    this.get_pages = () => {
        get('/api/page/list', 'pages');
    };
    let new_page = () => {
        var title = this.page.title;
        api.pages.post({
            title: title,
            content: this.page.content
        }).then((data) => {
            if (data.result !== false) {
                this.pages.forEach(function(page) {
                    if (page.title == title) {
                        page.id = data.result[0];
                    }
                });
                translatedNotifications.showSuccess({
                    message: 'Save successfull'
                });
            }
        });
    };
    let update = () => {
        api.pages.post({
            id: this.page.id,
            title: this.page.title,
            content: this.page.content
        }).then((data) => {
            if (data.result) {
                translatedNotifications.showSuccess({
                    message: 'Save successfull'
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
            api.pages.delete(id).then((data) => {
                if (data.result) {
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

controller.$inject = ['$http', 'translatedNotifications', 'editorOptions', 'api'];

export default controller;
