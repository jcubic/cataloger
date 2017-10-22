/* global root */

import $ from 'jquery';

function controller($http) {
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
                alert('saved');
                // toaster
            }
        });
    };
    this.delete_page = (id) => {
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
    };
    this.save = () => {
        if (!this.page.id) {
            new_page();
        } else {
            update();
        }
    };
    this.new_page = () => {
        this.pages.push({
            title: 'untitled',
            content: ''
        });
    };
    this.view = (page) => {
        this.page = page;
    };
    this.get_pages();
};

controller.$inject = ['$http'];

export default controller;
