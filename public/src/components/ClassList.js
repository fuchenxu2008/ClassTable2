import React, { Component } from 'react';
import ClassCard from './ClassCard';

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
                    :   'No class'
                }
            </div>
        );
    }
}

export default ClassList;