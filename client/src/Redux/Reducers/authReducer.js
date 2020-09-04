import { USER_LOADING, LOGIN_SUCCESS, LOGIN_FAILED, AUTH_FAILED, SET_STATE,LOGOUT_SUCCESS, SIGNUP_FAILED } from '../Types';

const initialState = {
    isLoading: false,
    isAuthenticated: false,
    token:'',
    error:''
}

export const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOADING: return {
            ...state,
            isLoading: true,
            error:''
        }
        case LOGIN_SUCCESS:
            localStorage.setItem('token',action.payload.token);
            localStorage.setItem('isAuthenticated',action.payload.isAuthenticated);
            return {
                ...state,
                token:action.payload.token,
                isLoading: false,
                isAuthenticated: true,
                error:''
            }
        case LOGIN_FAILED:
        case AUTH_FAILED:
        case LOGOUT_SUCCESS:
        case SIGNUP_FAILED:
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
            return {
                token:'',
                isLoading: false,
                isAuthenticated: false,
                error:action.payload.err
            }
        case SET_STATE:
            console.log('Set_State ka reducer');
            return {
                ...state,
                isAuthenticated:action.payload.isAuthenticated,
                token:action.payload.token,
                error:''
            }
        default:
            return state;

    }

}