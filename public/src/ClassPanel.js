import React, { Component } from 'react';
import moment from 'moment';
import CalendarView from './components/CalendarView';
import ClassList from './components/ClassList';

class ClassPanel extends Component {
    constructor() {
        super();
        this.state = { today_classes: [] }
    }

    componentWillMount() {
        let classes = localStorage.getItem('classes');
        if (!classes) { return; }
        classes = JSON.parse(classes);
        // console.log(classes);
        const today_weekday = moment().weekday();
        const today_date = moment().format("YYYY-MM-DD");
        // console.log(today_weekday, today_date);
        let today_classes = [];
        Object.keys(classes).forEach((weekDay, index) => {
            // console.log(index, today_weekday); 
            if (index === today_weekday-5) {
                // console.log('today is', index + 1);
                today_classes = classes[weekDay].classes;
            }
        });
        // console.log(today_classes);
        this.setState({ today_classes });
    }

    render() {
        const { today_classes } = this.state;
        return (
            <div>
                <CalendarView />
                <ClassList classes={today_classes} />
            </div>
        );
    }
}

export default ClassPanel;