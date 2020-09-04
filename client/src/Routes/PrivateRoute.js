import React from 'react';
import { Route,Redirect } from 'react-router-dom';
function PrivateRoute({ component:Component, authenticated }) {

    return (
        <>
            <Route
                render={(props) => authenticated === true
                    ? <Component {...props} />
                    : <Redirect to={{ pathname: '/', state: { from: props.location } }} />

                }
            />
        </>
    )


}

export default PrivateRoute;