import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import './styles/index.scss';
import {routes, redirections} from './RouteConfig';

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
            {redirections.map((redirection, indx) => {
                return <Redirect exact key={indx} from={redirection.from} to={redirection.to} />;
            })}
            {routes.map((route, index) => {
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
