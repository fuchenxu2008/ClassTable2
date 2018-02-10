import React, { Component } from 'react';
import { Card } from 'antd';

class ClassCard extends Component {

    render() {
        const { Class } = this.props;
        return (
            <Card style={{ width: '100%' }}>
                <h3>{Class.classTitle} by {Class.lecturer}</h3>
                <p>{Class.startTime} - {Class.endTime}</p>
                <p>{Class.location}</p>
            </Card>
        );
    }
}

export default ClassCard;