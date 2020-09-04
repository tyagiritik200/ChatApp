import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './Redux/store';
import Route from './Routes/Route';

function App(){
    return (
        <Provider store={store}>
        <Router>
            <Route/>
        </Router>
        </Provider>
    )
}

export default App;