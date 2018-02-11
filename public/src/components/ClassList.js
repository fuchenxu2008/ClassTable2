import React, { Component } from 'react';
import './ClassList.css';
import ClassCard from './ClassCard';
import { Icon } from 'antd';

class ClassList extends Component {

    render() {
        const { classes } = this.props;
        return (
            <div>
                {
                    classes.length > 0
                    ?   classes.map((Class, index) => {
                            return (
                                <ClassCard key={index} Class={Class} />
                            )
                        })
                    :   <div className="no-class">
                            <Icon type="coffee" /> No class, take a break ～
                        </div>
                }
            </div>
        );
    }
}

export default ClassList;