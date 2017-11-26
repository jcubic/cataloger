
function api($http, root) {
    var data = response => response.data;
    function make_post_fn(url) {
        return function(data) {
            return $http({
                method: 'POST',
                url: root + url,
                data: data
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
        }
    };
}

api.$inject = ['$http', 'root'];


export default api;
