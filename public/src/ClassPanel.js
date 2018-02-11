import React, { Component } from 'react';
import moment from 'moment';
import { Divider } from 'antd';
import Navbar from './components/Navbar';
import CalendarView from './components/CalendarView';
import ClassList from './components/ClassList';

moment.locale('zh-cn', {
    week: {
        dow: 1 // Monday is the first day of the week
    }
});

function numberRange(start, end) {
    return new Array(end - start).fill().map((d, i) => i + start);
}

class ClassPanel extends Component {
    constructor() {
        super();
        this.state = { 
            classTable: {},
            classesOfDay: [],
            selected_date: moment(),
            selected_week: 0
        }
        this.onSelect = this.onSelect.bind(this);
        this.getWeek = this.getWeek.bind(this);
        this.getClassesOfDay = this.getClassesOfDay.bind(this);
    }

    getWeek() {
        const termStart = moment("2018-02-26", "YYYY-MM-DD");
        const selectedDay = moment(this.state.selected_date);     
        return Math.floor(selectedDay.diff(termStart, 'days') / 7) + 1;
    }

    getInterval(period) {
        const intervals = period.split(':')[1].split(',').map(interval => interval.trim());
        let intervalDict = {};
        intervals.forEach(interval => {
            const startEnd = interval.split('-');
            const start = startEnd[0];
            if (startEnd.length > 1) {
                intervalDict[start] = startEnd[1];
            } else {
                intervalDict[start] = start;
            }
        });
        let intervalScope = [];
        Object.keys(intervalDict).forEach(start => {
            intervalScope = intervalScope.concat(numberRange(parseInt(start, 10), parseInt(intervalDict[start], 10) + 1));
        });
        return intervalScope;
    }    

    async onSelect(selected_date) {
        await this.setState({ selected_date });
        this.getClassesOfDay();        
    }

    getClassesOfDay() {
        const { classTable, selected_date } = this.state;
        let classesOfDay = [];
        // Monday 0 -- Friday 4
        Object.keys(classTable).forEach((weekDay, index) => {
            if (index === selected_date.weekday()) {          
                classesOfDay = classTable[weekDay].classes;
            }
        });
        classesOfDay = classesOfDay.filter(Class => {
            return this.getInterval(Class.period).includes(this.getWeek());
        })
        this.setState({ classesOfDay, selected_week: this.getWeek() }); 
    }

    async componentDidMount() {
        let classes = localStorage.getItem('classes');
        if (!classes) { 
            classes = sessionStorage.getItem('classes');
            if (!classes) { return; }
        }
        await this.setState({ classTable: JSON.parse(classes) })
        this.getClassesOfDay();
    }

    render() {
        const { classesOfDay, selected_week } = this.state;
        return (
            <div>
                <Navbar/>
                <div className="classpanel">
                    <CalendarView onSelect={this.onSelect} />
                    {selected_week >= 1 && selected_week <= 14 &&
                        <Divider>Week {selected_week}</Divider>
                    }
                    <ClassList classes={classesOfDay} />
                </div>
            </div>   
        );
    }
}

export default ClassPanel;