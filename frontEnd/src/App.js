import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import './App.css';

import CustomSlider from './component/Slider/Slider';
import LoginPage from './page/Login/Login';
import RegisterPage from './page/Register/Register';

import { history } from './utils/history';
import { PrivateRoute } from './utils/privateRoute';

import './i18n/i18n';

function App() {
    return (
        <Router history={history}>
            <Switch>
                <PrivateRoute exact path="/" component={CustomSlider} />
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <Redirect from="*" to="/" />
            </Switch>
        </Router>
    );
}

export default App;
