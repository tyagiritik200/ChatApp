import { SET_STATE, AUTH_FAILED } from '../Types';
import Axios from 'axios';
export const SetState = () => (dispatch) => {
    const isAuthenticated = (localStorage.getItem('isAuthenticated')) ? true : false;
    const token = localStorage.getItem('token');
    if (isAuthenticated) {
        dispatch({
            type: SET_STATE,
            payload: {
                isAuthenticated,
                token
            }
        })
    }
    else {
        dispatch({
            type: SET_STATE,
            payload: {
                isAuthenticated,
                token: ''
            }
        })
    }

}