/* global FormData */
import $ from 'jquery';
// TODO: modify all requests to send JSON and require application/json Content-type
// to prevent CSRF
function api($http, root) {
    var data = response => response.data;
    function update_url(url, args) {
        if (args.length) {
            var i = 0;
            return url.replace(/\{([^}]+)\}/g, function(_, name) {
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
        return function(post_data) {
            return $http({
                method: 'POST',
                url: root + url,
                data: type == 'json' ? post_data : $.param(post_data),
                headers: headers
            }).then(data);
        };
    }
    function make_delete_fn(url) {
        return function(...args) {
            return $http({
                method: 'DELETE',
                url: root + update_url(url, args)
            }).then(data);
        };
    }
    function make_get_fn(url) {
        return function() {
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
            upload: function(file) {
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
}

api.$inject = ['$http', 'root'];


export default api;
