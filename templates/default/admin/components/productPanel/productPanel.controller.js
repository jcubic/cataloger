/* global root */

function controller($http) {
    this.products = [];
    let get = (url, variable) => {
        $http({method: 'GET', url: root + url}).then((response) => {
            this[variable] = response.data;
        });
    };
    this.get_categories = () => {
        get('/api/category/list', 'categories');
    };
    this.get_products = () => {
        get('/api/product/list', 'products');
    };
    this.new_product = () => {
        $http({
            method: 'POST',
            url: root + '/api/product/new',
            data: {
                name: this.name,
                price: this.price || null,
                category: this.category
            }
        }).then((response) => {
            if (response.result) {
                this.get_products();
            }
        });
    };
    this.get_products();
    this.get_categories();
};

controller.$inject = ['$http'];

export default controller;
