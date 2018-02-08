import React, { Component } from 'react';
import './Description.css';
import { Row, Col, Button } from 'antd';

export default class Description extends Component {

    render() {
        return (
            <div>
                <Row className="description">
                    <Col xs={12}>
                        <Button type="primary" ghost className="help-button">Manual</Button>
                    </Col>
                    <Col xs={12} style={{textAlign: 'right'}}>
                        <Button type="primary" ghost className="help-button">Contact</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}