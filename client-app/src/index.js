import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import routeConfig from './RouteConfig';

const queryParams = (queryString) => {
    let params = {};
    queryString &&
        queryString
            .split('?')[1]
            .split('&')
            .forEach((param) => {
                const [key, val] = param.split('=');
                params[key] = val;
            });
    return params;
};

ReactDOM.render(
    <Router>
        <Switch>
            {routeConfig.map((route, index) => {
                return (
                    <Route
                        key={index}
                        exact
                        path={route.path}
                        render={(props) => (
                            <route.component {...props.match.params} {...queryParams(props.location.search)} />
                        )}
                    />
                );
            })}
        </Switch>
    </Router>,
    document.getElementById('root')
);
