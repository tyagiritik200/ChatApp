import {combineReducers,createStore,applyMiddleware} from 'redux';
import { AuthReducer } from './Reducers/authReducer';


import logger from 'redux-logger';

import {composeWithDevTools} from 'redux-devtools-extension';


const thunkMiddleware=require('redux-thunk').default;



const reducer=combineReducers({
    auth:AuthReducer
})

const store=createStore(reducer,composeWithDevTools(applyMiddleware(thunkMiddleware)));

export default store;
