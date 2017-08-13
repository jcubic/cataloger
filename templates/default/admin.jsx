import 'promise-polyfill';
import 'whatwg-fetch';
import { h, app } from 'hyperapp';
import {Navigation, Panels} from './plugins';

function categories() {
    return $.get(root + '/api/category/list', $.noop, 'json');
}
function products() {
    return [];
}

Promise.all([categories(), products()]).then(function([categories, products]) {
    app({
        state: {
            view: "categories",
            categories: categories,
            products: []
        },
        view: function(state, actions) {
            function navigation(e, view) {
                actions.navigation(view);
                e.preventDefault();
            }
            return (
                <div>
                  <Navigation navigation={navigation}/>
                  <Panels state={state} actions={actions}/>
                </div>
            );
        },
        actions: Object.assign({}, actions, {
            navigation: function(state, actions, view) {
                return {view};
            }
        })
    });
});

