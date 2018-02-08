import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import uuidv4 from 'uuid/v4';
import './LoginPanel.css';

import { Layout, Row, Col } from 'antd';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

class NormalLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uname: '',
            psw: '',
            socketId: uuidv4()
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUnameChange = this.handleUnameChange.bind(this);
        this.handlePswChange = this.handlePswChange.bind(this);
    }

    componentDidMount() {
        const cachedCredential = localStorage.getItem('userCredential');
        if (cachedCredential) {
            const user = JSON.parse(cachedCredential);
            this.setState({ uname: user.uname, psw: user.psw })
        }
    }

    handleUnameChange(e) {
        this.setState({ uname: e.target.value });
    }

    handlePswChange(e) {
        this.setState({ psw: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const socket = io.connect('http://192.168.1.101:3001')
                console.log('socket requested');
                socket.on('connect_error', function (err) {
                    console.log('Server is offline...');
                });
                socket.on(this.state.socketId, (data) => {
                    console.log('Socket:', data);
                })
                
                axios.post('http://192.168.1.101:3001/ebridge/class', {
                    uname: this.state.uname,
                    psw: this.state.psw,
                    socketId: this.state.socketId
                })
                .then(res => {
                    console.log(res);
                    if (res.data.token) {
                        localStorage.setItem('userCredential', JSON.stringify({
                            uname: this.state.uname,
                            psw: this.state.psw
                        }))
                        window.location.href = `http://192.168.1.101:3001/ebridge/download/${res.data.token}`;
                    } else {
                        console.log('Invalid Credentials');
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem hasFeedback validateStatus="validating" className="login-form-input">
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input onChange={this.handleUnameChange} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                    )}
                </FormItem>
                <FormItem className="login-form-input">
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input onChange={this.handlePswChange} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>Remember me</Checkbox>
                    )}
                    <a 
                        className="login-form-forgot" 
                        href="https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/siw_pqs.forgot?"
                    >Forgot password</a>  
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const LoginPanel = Form.create()(NormalLoginForm);

export default LoginPanel;