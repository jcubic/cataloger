function controller($http) {
    this.products = [];
    let get = (url, variable) => {
        $http({method: 'GET', url: root + url}).then((response) => {
            this[variable] = response.data;
        });
    };
    this.password = {};
    this.save_password = function() {
        
    };
    
};

controller.$inject = ['$http'];

export default controller;
