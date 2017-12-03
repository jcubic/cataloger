/* global root */

function controller($http, $scope, translatedNotifications, api, editorOptions) {
    this.tinymce_options = editorOptions;
    this.products = [];
    this.images = [];
    let make_setter = variable => data => {
        return this[variable] = data;
    };
    this.get_images = () => {
        api.images.list().then((images) => {
            this.images = images.map(function(name) {
                return {name};
            });
        });
    };
    this.get_categories = () => {
        api.categories.list().then(make_setter('categories'));
    };
    this.get_products = () => {
        api.products.list().then(make_setter('products'));
    };
    function product_saved() {
        translatedNotifications.showSuccess({
            message: 'Save successfull'
        });
        this.get_products();
    }
    let new_product = () => {
        api.products.post({
            name: this.product.name,
            price: this.product.price || null,
            content: this.product.content || null,
            image_name: this.product.image_name || null,
            category: this.product.category ? this.product.category.id : null
        }).then(product_saved);
    };
    let update = () => {
        api.products.post({
            name: this.product.name,
            price: this.product.price || null,
            content: this.product.content || null,
            image_name: this.product.image_name || null,
            category: this.product.category ? this.product.category.id : null,
            id: this.product.id
        }).then(product_saved);
    };
    this.new_product = () => {
        var untitled = this.products.filter((product) => {
            return product.name.match(/^untitled/);
        });
        this.products.push({
            name: 'untitled ' + (untitled.length + 1)
        });
    };
    this.save = () => {
        if (this.product.id) {
            update();
        } else {
            new_product();
        }
    };
    this.view = (product) => {
        this.product = product;
        if (this.product.category && !this.product.category.id) {
            for (var i = 0; i < this.categories.length; ++i) {
                var category = this.categories[i];
                if (category.id == this.product.category) {
                    this.product.category = category;
                    break;
                }
            }
        }
    };
    this.delete_product = (index) => {
        var product = this.products[index];
        var id = product.id;
        if (typeof id === 'undefined') {
            var name = product.name;
            this.products = this.products.filter((page) => page.name != name);
        } else {
            api.products.delete(id).then((data) => {
                if (data.result) {
                    this.products = this.products.filter((product) => {
                        return product.id != id;
                    });
                }
            });
        }
    };
    this.upload = (file) => {
        console.log(file);
        api.images.upload(file);
    };
    let init = () => {
        this.get_products();
        this.get_categories();
        this.get_images();
        delete this.product;
    };
    init();
    $scope.$on('view:products', init);
};

controller.$inject = ['$http', '$scope', 'translatedNotifications', 'api', 'editorOptions'];

export default controller;
