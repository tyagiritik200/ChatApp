import React from 'react';
import { Route,Redirect } from 'react-router-dom';
function PrivateRoute({ component:Component, authenticated }) {

    return (
        <>
            {console.log('In private route of chat and authenticated is :'+authenticated)}
            <Route
                render={(props) => authenticated === true
                    ? <Component {...props} />
                    : <Redirect to={{ pathname: '/' }} />

                }
            />
        </>
    )


}

export default PrivateRoute;