import React, { Component } from 'react';
import './LoginPanel.css';
// import Register from './Register/Register';
import Login from './Login/Login';
// import {
//     BrowserRouter as Router,
//     Route,
//     Link
// } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import uuidv4 from 'uuid/v4';
// var calData = require('./calData');
// var ICAL = require('ical.js');

class LoginPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uname: '',
            psw: '',
            socket: null,
            socketId : uuidv4()
        }
        this.handleUnameChange = this.handleUnameChange.bind(this);
        this.handlePswChange = this.handlePswChange.bind(this);
        this.getCal = this.getCal.bind(this);
    }

    render() {
        return (
            <div className="card loginPanel">
                <h5 className="card-header">
                    Login
                </h5>
                <div className="card-body">
                    <Login onLogin={this.getCal} onUnameChange={this.handleUnameChange} onPswChange={this.handlePswChange}/>
                </div>
            </div>
        
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
        this.setState({ socket: io('http://192.168.1.102:3001') }, () => {
            console.log('socket requested');
            this.state.socket.on(this.state.socketId, (data) => {
                console.log('Socket:', data);
            })
        });
        
        axios.post('http://192.168.1.102:3001/ebridge/class', {
            uname: this.state.uname,
            psw: this.state.psw,
            socketId: this.state.socketId
        })
        .then(res => {
            console.log(res);
            if (res.data.token) {
                window.location.href = `http://192.168.1.102:3001/ebridge/download/${res.data.token}`;
            } else{
                console.log('Invalid Credentials');
            }   
        })
        .catch(err => {
            console.log(err);
        })
    }
}

export default LoginPanel;