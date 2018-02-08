import React, { Component } from 'react';
import LoginPanel from './containers/LoginPanel';
import Navbar from './components/Navbar';
import Display from './components/Display';

import { Layout, Row, Col } from 'antd';
const { Header, Content, Footer } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { containerHeight: '100%' };
    }

    componentDidMount() {
        this.setState({ containerHeight: this.container.clientHeight });
        console.log(this.container.clientHeight);
    }

    render() {
        return (
            <div className="container" ref={(container) => this.container = container}>
                <Row>
                    <Col lg={9} md={12} sm={15}>
                        <h1 className="banner">ClassTable</h1>
                        <LoginPanel />
                    </Col>
                    <Col lg={15} md={12} sm={9}><Display height={this.state.containerHeight} /></Col>
                </Row>
            </div>
        );
    }
}

export default App;