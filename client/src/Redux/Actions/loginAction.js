import { USER_LOADING, LOGIN_SUCCESS, LOGIN_FAILED, SIGNUP_FAILED } from '../Types';
import Axios from 'axios';
import { SetState } from './setStateAction';

export const loginUser = (email, pass, google = false) => (dispatch) => {
    dispatch({ type: USER_LOADING });
    Axios.post('/user/login', {
        email,
        pass,
        google
    })
        .then(result => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    token: result.data.token,
                    isAuthenticated: true
                }
            })
        })
        .catch(err => {
            console.log('Error is :' + err);
            dispatch({
                type: LOGIN_FAILED,
                payload: {
                    err: err.response.data.err
                }
            })
        })
}


export const SignUp = (user) => (dispatch) => {
    dispatch({
        type: USER_LOADING
    })
    Axios.post('/user/addNewUser', {
        name: user.name,
        email: user.email,
        pass: user.pass,
        confpass: user.confpass,
        google: false
    })
        .then(data => {
            window.location = '/';
        })
        .catch(err => {
            dispatch({
                type: SIGNUP_FAILED,
                payload: {
                    err: err.response.data.err
                }
            })
        })
}