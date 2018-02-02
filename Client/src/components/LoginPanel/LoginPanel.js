import React, { Component } from 'react';
import './LoginPanel.css';
import Register from './Register/Register';
import Login from './Login/Login';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import axios from 'axios';
// var calData = require('./calData');
// var ICAL = require('ical.js');

class LoginPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uname: '',
            psw: ''
        }
        this.handleUnameChange = this.handleUnameChange.bind(this);
        this.handlePswChange = this.handlePswChange.bind(this);
        this.getCal = this.getCal.bind(this);
    }

    render() {
        return (
            <Router>
                <div className="card loginPanel">
                    <h5 className="card-header">
                        <Link to="/">Login</Link>&nbsp;/&nbsp;
                        <Link to="/register">Register</Link>
                    </h5>
                    <div className="card-body">
                    <Login onLogin={this.getCal} onUnameChange={this.handleUnameChange} onPswChange={this.handlePswChange}/>
                        <Route exact path="/" component={Login}/>
                        <Route path="/register" component={Register} />
                    </div>
                </div>
            </Router>
        );
    }

    handleUnameChange(uname) {
        this.setState({ uname });
    }

    handlePswChange(psw) {
        this.setState({ psw });
    }

    getCal(e) {
        e.preventDefault();
        axios.post('http://172.20.10.2:3001/ebridge/class', {
            uname: this.state.uname,
            psw: this.state.psw
        })
        .then(url => {
            window.location.href = url.data
        })
    }

    // componentDidMount() {
    //     var icalObject = ICAL.parse(calData);
    //     var comp = new ICAL.Component(icalObject);
    //     var vevent = comp.getFirstSubcomponent("vevent");
    //     var summary = vevent.getFirstPropertyValue("summary");
    //     console.log(comp);
    //     console.log(vevent);
    //     console.log(summary);
    // }
}

export default LoginPanel;