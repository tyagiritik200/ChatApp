import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import { SetState } from '../Redux/index'
import Layout from '../Component/layout';
import Login from '../Component/login';
import Signup from '../Component/signup';
import VerifyOTP from '../Component/verifyOtp';
import jwt from 'jsonwebtoken';
import {SECRET} from '../env';
const SECRETKEY=process.env.SECRET || SECRET;
function Route() {
    const token = useSelector(state => state.auth.token);
    const auth = useSelector(state => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    useEffect(() => {
        console.log('In Route')
        if (auth === true) {
            jwt.verify(token,SECRETKEY,(err,decode)=>{
                if(err)
                {
                    dispatch({
                        type:'LOGOUT_SUCCESS',
                        payload:{
                            err:''
                        }
                    })
                }
            })
        }
        dispatch(SetState())
    })
    return (
        <>
            <Router>
                <Switch>
                    <PrivateRoute exact path='/chat' authenticated={auth} component={Layout} />
                    <PublicRoute exact path='/' authenticated={auth} component={Login} />
                    <PublicRoute exact path='/signup' authenticated={auth} component={Signup} />
                    <PublicRoute path='/forgot' authenticated={auth} component={VerifyOTP} />
                </Switch>
            </Router>
        </>
    )
}

export default Route;