import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import uuidv4 from 'uuid/v4';
import { Redirect } from 'react-router-dom';
import './LoginPanel.css';
import config from '../config';
import ProgressModal from './ProgressModal';
import { Form, Icon, Input, Button, Checkbox, Modal, message, Switch, notification } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;

class NormalLoginForm extends Component {
    state = {
        uname: '',
        psw: '',
        remember: true,
        mailChecked: false,
        email: '',
        validateStatus: '',
        iconLoading: false,
        showModal: false,
        currentStep: 0,
        redirect: false
    }

    componentDidMount() {
        // this.openNotification();
        const cachedCredential = localStorage.getItem('userCredential');
        if (cachedCredential) {
            const user = JSON.parse(cachedCredential);
            this.setState({ uname: user.uname, psw: user.psw });
            this.props.form.setFieldsValue({
                userName: user.uname,
                password: user.psw,
            });
        }
    }

    handleUnameChange = (e) => {
        this.setState({ uname: e.target.value, validateStatus: '' })
    }

    handlePswChange = (e) => {
        this.setState({ psw: e.target.value, validateStatus: '' })
    }

    onMailSwitchChange = (mailChecked) => {
        this.setState({ mailChecked });
    }

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value });
    }

    handleRememberChange = (e) => {
        this.setState({ remember: e.target.checked });
    }

    showConfirm = () => {
        confirm({
            title: `Welcome back ${this.state.uname} !`,
            content: `Local calendar found, directly go to your cached calendar or refresh?`,
            okText: 'Refresh',
            cancelText: 'See local',
            onOk: () => this.login(),
            onCancel: () => this.setState({ redirect: true }),
        });
    }

    openNotification = () => {
        notification.success({
            message: 'Email sent！',
            description: <div>Your calendar file has been sent.<br /><b>Check for Spam or Trash Box if not found!</b></div>,
        });
    }

    login = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ iconLoading: true, showModal: true })
                const { uname, psw, remember, email, mailChecked } = this.state;
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

                let formBody = { uname, psw, socketId };
                if (mailChecked) formBody['email'] = email;

                axios.post(`${config.domain}/ebridge/class?download=1`, formBody)
                    .then(res => {
                        this.setState({ iconLoading: false, showModal: false, currentStep: 0 });
                        if (res.data.rawClass) {
                            if (remember) {
                                localStorage.setItem('userCredential', JSON.stringify({ uname, psw }));
                                localStorage.setItem('classes', JSON.stringify(res.data.rawClass));
                            } 
                            sessionStorage.setItem('classes', JSON.stringify(res.data.rawClass));
                            sessionStorage.setItem('userCredential', JSON.stringify({ uname, psw }));
                            
                            this.setState({ validateStatus: 'success', redirect: true });
                            if ((/MicroMessenger/i).test(navigator.userAgent.toLowerCase()) && !mailChecked) {
                                message.warning('WeChat blocked the download !', 5);
                            }
                            if (!mailChecked) {
                                setTimeout(function () {
                                    document.location.href = `${config.domain}/ebridge/download?token=${res.data.token}`;
                                }, 250);
                            } else this.openNotification()
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

    handleSubmit = (e) => {
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
        const { validateStatus, iconLoading, showModal, currentStep, redirect, mailChecked } = this.state;

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
                {
                    mailChecked &&
                    <FormItem className="login-form-input">
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email', message: 'The input is not valid E-mail!',
                            }, {
                                required: true, message: 'Please input your E-mail!',
                            }],
                        })(
                            <Input size="large" onChange={this.handleEmailChange} prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Enter Non-XJTLU Mail" />
                        )}
                    </FormItem>
                }
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox onChange={this.handleRememberChange}>Remember me</Checkbox>
                    )}
                    <div className="login-form-forgot">
                        <Switch onChange={this.onMailSwitchChange} checked={mailChecked} /> Mail me
                    </div>
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