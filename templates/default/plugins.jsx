import { h } from 'hyperapp';

export function Navigation({navigation}) {
    return (
        <ul>
          <li>
            <a href="#" onclick={(e) => navigation(e, "categories")}>
              categories
            </a>
          </li>
          <li>
            <a href="#" onclick={(e) => navigation(e, "sitemap")}>
              Sitemap
            </a>
          </li>
        </ul>
    );
}

function PluginSitemap({state, actions, style}) {
    return <div style={style}>Sitemap</div>;
}
function PluginCategories({state, actions, style}) {
    return <div style={style}>Categories</div>;
}

export function Panels({state, actions}) {
    const style = (view) => {
        return {
            display: state.view == view ? 'block' : 'none'
        };
    }
    return (
        <div>
          <PluginSitemap style={style('sitemap')}
                         state={state} actions={actions}/>
          <PluginCategories style={style('categories')}
                            state={state} actions={actions}/>
        </div>
    );
}
