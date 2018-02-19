import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import LoginPanel from './components/LoginPanel';
import Display from './components/Display';
import Description from './components/Description';
import config from './config';

import { Row, Col, Divider, notification } from 'antd';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            containerHeight: '100%',
            downloads: 0,
            redirect: false
        };
        this.getDownloads = this.getDownloads.bind(this);
    }

    getDownloads() {
        let newVisit;
        if (sessionStorage.getItem('visit')) {
            newVisit = false;
        } else {
            sessionStorage.setItem('visit', 'user');
            newVisit = true;
        }
        const userAgent = window.navigator.userAgent;
        axios.post(`${config.domain}/ebridge/count`, { newVisit, userAgent })
            .then(res => {
                this.setState({ downloads: res.data.count })
            })
            .catch(err => {
                console.log(err);  
            })
    }

    openNotification() {
        notification.info({
            message: '微信小程序版本上线！',
            description: 'Now in WeChat, check it out!',
        });
    }

    componentDidMount() {
        if (localStorage.getItem('classes') && !sessionStorage.getItem('classes')) {
            sessionStorage.setItem('classes', localStorage.getItem('classes'));
            return this.setState({ redirect: true });
        }
        this.setState({ containerHeight: this.container.clientHeight });
        this.getDownloads();
        if (!sessionStorage.getItem('classes')) {
            this.openNotification();
        }
    }

    render() {
        if (this.state.redirect) return <Redirect to='/myclass' />;
        return (
            <div className="container" ref={(container) => this.container = container}>
                <Row>
                    <Col lg={9} md={12}>
                        <h1 className="banner">ClassTable</h1>
                        <LoginPanel/>
                        <Divider className="divider" dashed>  Get Help  </Divider>
                        <Description/>
                    </Col>
                    <Col lg={15} md={12}><Display height={this.state.containerHeight} /></Col>
                    <Col xs={24}>
                        <Divider className="divider" dashed>
                            Downloads: {this.state.downloads}   
                        </Divider>
                    </Col>
                    </Row>
            </div>
        );
    }
}

export default HomePage;