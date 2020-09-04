import React from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
function PublicRoute({ component:Component, authenticated }) {

    var history = useHistory();

    const { from } = history.location.state || {
        from: { pathname: '/chat' }
    }

    return (
        <Route
            render={(props) => authenticated === false
                ? <Component/>
                : <Redirect to={from} />

            }
        />
    )


}

export default PublicRoute;