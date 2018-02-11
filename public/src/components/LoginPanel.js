import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import uuidv4 from 'uuid/v4';
import jwt from 'jsonwebtoken';
import { Redirect } from 'react-router-dom';
import './LoginPanel.css';
import config from '../config';
import ProgressModal from './ProgressModal';
import { Form, Icon, Input, Button, Checkbox, Modal, message } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;

class NormalLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uname: '',
            psw: '',
            remember: true,
            validateStatus: '',
            iconLoading: false,
            showModal: false,
            currentStep: 0,
            redirect: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
        this.handleUnameChange = this.handleUnameChange.bind(this);
        this.handlePswChange = this.handlePswChange.bind(this);
        this.handleRememberChange = this.handleRememberChange.bind(this);
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

    handleRememberChange(e) {
        this.setState({ remember: e.target.checked });
    }

    showConfirm() {
        confirm({
            title: `Welcome back ${this.state.uname} !`,
            content: `Local calendar found, directly go to your calendar? or 'Cancel' to refresh.`,
            onOk: () => {
                this.setState({ redirect: true })
            },
            onCancel: () => { this.login(); },
        });
    }

    login() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ iconLoading: true, showModal: true })
                const { uname, psw, remember } = this.state;
                if (!remember) {
                    localStorage.clear();
                }

                const socket = io.connect(config.domain);
                const socketId = uuidv4();
                socket.on(socketId, (data) => {
                    if (!isNaN(parseInt(data, 10))) {
                        const currentStep = parseInt(data, 10);
                        this.setState({ currentStep });
                        console.log('current:', currentStep);
                    }
                })

                const credentialToken = jwt.sign({ uname, psw }, config.secret);

                axios.post(`${config.domain}/ebridge/class`, { credentialToken, socketId })
                    .then(res => {
                        this.setState({ iconLoading: false, showModal: false, currentStep: 0 });
                        if (res.data.token) {
                            if (remember) {
                                localStorage.setItem('userCredential', JSON.stringify({ uname, psw }));
                                localStorage.setItem('classes', JSON.stringify(res.data.rawClass));
                            } else {
                                sessionStorage.setItem('classes', JSON.stringify(res.data.rawClass));
                            }
                            this.setState({ validateStatus: 'success', redirect: true });
                            const ua = navigator.userAgent.toLowerCase();                            
                            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                                message.warning('WeChat blocked the download !', 3);
                            }
                            window.location.href = `${config.domain}/ebridge/download/${res.data.token}`;
                        } else {
                            this.setState({ validateStatus: 'error' })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const cachedCredential = localStorage.getItem('userCredential');
        if (cachedCredential && localStorage.getItem('classes')) {
            if (JSON.parse(cachedCredential).uname === this.state.uname) {
                this.showConfirm();
            } else this.login();
        } else this.login();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { validateStatus, iconLoading, showModal, currentStep, redirect } = this.state;

        if (redirect) return <Redirect to='/myclass' /> ;
        
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
                        <Checkbox onChange={this.handleRememberChange}>Remember me</Checkbox>
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