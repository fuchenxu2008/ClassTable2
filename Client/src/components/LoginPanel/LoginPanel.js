import React, { Component } from 'react';
import './LoginPanel.css';
import Register from './Register/Register';
import Login from './Login/Login';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

class LoginPanel extends Component {
    // constructor(props) {
    //     super(props);
    //     // this. = this. .bind(this);
    // }

    render() {
        return (
            <Router>
                <div class="card loginPanel">
                    <h5 class="card-header">
                        <Link to="/">Login</Link>&nbsp;/&nbsp;
                        <Link to="/register">Register</Link>
                    </h5>
                    <div class="card-body">
                        <Route exact path="/" component={Login}/>
                        <Route path="/register" component={Register} />
                    </div>
                </div>
            </Router>
        );
    }
}

export default LoginPanel;