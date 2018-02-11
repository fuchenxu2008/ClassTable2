import React, { Component } from 'react';
import './ClassList.css';
import ClassCard from './ClassCard';
import { Icon } from 'antd';

class ClassList extends Component {

    render() {
        const { classes } = this.props;
        
        let content = <div className="no-class"><Icon type="coffee" /> No class, take a break ～</div>
        if (classes.length > 0) {
            if (classes[0].holiday) {
                content = <div className="no-class"><Icon type="schedule" /> {classes[0].holiday}</div>
            } else {
                content = classes.map((Class, index) => {
                    return (
                        <ClassCard key={index} Class={Class} />
                    )
                })
            }
        }

        return (
            <div>
                { content }
            </div>
        );
    }
}

export default ClassList;