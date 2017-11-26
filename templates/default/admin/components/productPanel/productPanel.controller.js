/* global root */

function controller($http, $scope, api, editorOptions) {
    this.tinymce_options = editorOptions;
    this.products = [];
    let make_setter = variable => data => {
        console.log(data);
        return this[variable] = data;
    };
    this.get_categories = () => {
        api.categories.list().then(make_setter('categories'));
    };
    this.get_products = () => {
        api.products.list().then(make_setter('products'));
    };
    let new_product = () => {
        api.products.post({
            name: this.product.name,
            price: this.product.price || null,
            content: this.product.content || null,
            category: this.product.category
        }).then(() => this.get_products());
    };
    let update = () => {
        api.products.post({
            name: this.product.name,
            price: this.product.price || null,
            content: this.product.content || null,
            category: this.product.category,
            id: this.product.id
        }).then(() => this.get_products());
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
        if (!this.product.id) {
            update();
        } else {
            new_product();
        }
    };
    this.view = (product) => {
        this.product = product;
    };
    let init = () => {
        this.get_products();
        this.get_categories();
        delete this.product;
    };
    init();
    $scope.$on('view:products', init);
};

controller.$inject = ['$http', '$scope', 'api', 'editorOptions'];

export default controller;
