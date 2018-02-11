import React, { Component } from 'react';
import './ClassCard.css';
import { Card } from 'antd';

class ClassCard extends Component {

    render() {
        const { Class } = this.props;
        return (
            <Card className="class-card">
                <h4><b>{Class.classTitle}</b></h4>
                <p style={{ color: 'rgb(37, 146, 252)' }}><b>{Class.startTime} - {Class.endTime}</b></p>
                <p>{Class.location}</p>
            </Card>
        );
    }
}

export default ClassCard;