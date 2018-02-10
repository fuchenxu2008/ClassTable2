import React, { Component } from 'react';
import axios from 'axios';
import LoginPanel from './components/LoginPanel';
import Display from './components/Display';
import Description from './components/Description';
import config from './config';

import { Row, Col } from 'antd';
import { Divider } from 'antd';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            containerHeight: '100%',
            'downloads': 0
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

    componentDidMount() {
        this.setState({ containerHeight: this.container.clientHeight });
        this.getDownloads();
    }

    render() {
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