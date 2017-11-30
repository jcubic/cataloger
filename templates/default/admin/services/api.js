/* global FormData */
import $ from 'jquery';

function api($http, root) {
    var data = response => response.data;
    function make_post_fn(url, type) {
        var headers = {};
        if (type != 'json') {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        return function(data) {
            return $http({
                method: 'POST',
                url: root + url,
                data: type == 'json' ? data : $.param(data),
                headers: headers
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
            list: make_get_fn('/api/product/list')
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
