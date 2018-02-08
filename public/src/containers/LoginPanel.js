import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import uuidv4 from 'uuid/v4';
import './LoginPanel.css';

import { Form, Icon, Input, Button, Checkbox } from 'antd';
import ProgressModal from '../components/ProgressModal';
const FormItem = Form.Item;

class NormalLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uname: '',
            psw: '',
            validateStatus: '',
            iconLoading: false,
            showModal: false,
            currentStep: 0
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUnameChange = this.handleUnameChange.bind(this);
        this.handlePswChange = this.handlePswChange.bind(this);
    }

    componentDidMount() {
        const cachedCredential = localStorage.getItem('userCredential');
        if (cachedCredential) {
            const user = JSON.parse(cachedCredential);
            this.setState({ uname: user.uname, psw: user.psw });
            this.props.form.setFieldsValue({
                userName: user.uname,
                password: user.psw
            });
        }
    }

    handleUnameChange(e) {
        this.setState({ uname: e.target.value, validateStatus: '' })
    }

    handlePswChange(e) {
        this.setState({ psw: e.target.value, validateStatus: '' })
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ 
                    iconLoading: true, 
                    showModal: true, 
                })

                const socket = io.connect('http://192.168.1.101:3001');
                const socketId = uuidv4();

                socket.on(socketId, (data) => {
                    if (!isNaN(parseInt(data, 10))) {
                        const currentStep = parseInt(data, 10);
                        this.setState({ currentStep });
                        console.log('current:', currentStep);
                    }
                })

                axios.post('http://192.168.1.101:3001/ebridge/class', {
                    uname: this.state.uname,
                    psw: this.state.psw,
                    socketId
                })
                .then(res => {
                    console.log(res);
                    if (res.data.token) {
                        this.setState({ validateStatus: 'success' })
                        localStorage.setItem('userCredential', JSON.stringify({
                            uname: this.state.uname,
                            psw: this.state.psw
                        }))
                        window.location.href = `http://192.168.1.101:3001/ebridge/download/${res.data.token}`;
                    } else {
                        console.log('Invalid Credentials');
                        this.setState({ validateStatus: 'error' })
                    }
                    this.setState({ iconLoading: false, showModal: false, currentStep: 0 });
                })
                .catch(err => {
                    console.log(err);
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { validateStatus, iconLoading, showModal, currentStep } = this.state;

        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem hasFeedback validateStatus={validateStatus} className="login-form-input">
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input size="large" onChange={this.handleUnameChange} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Ebridge Username"/>
                    )}
                </FormItem>
                <FormItem hasFeedback validateStatus={validateStatus} className="login-form-input">
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input size="large" onChange={this.handlePswChange} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password"/>
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
                    <Button size="large" loading={iconLoading} type="primary" htmlType="submit" className="login-form-button">
                         LOGIN
                    </Button>
                </FormItem>
                <ProgressModal visible={showModal} currentStep={currentStep} />
            </Form>
        );
    }
}

const LoginPanel = Form.create()(NormalLoginForm);

export default LoginPanel;