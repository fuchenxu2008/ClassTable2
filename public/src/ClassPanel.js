import React, { Component } from 'react';
import moment from 'moment';
import { Divider } from 'antd';
import Navbar from './components/Navbar';
import CalendarView from './components/CalendarView';
import ClassList from './components/ClassList';
import config from './config';

moment.locale('zh-cn', {
    week: {
        dow: 1 // Monday is the first day of the week
    }
});

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function numberRange(start, end) {
    return new Array(end - start).fill().map((d, i) => i + start);
}

class ClassPanel extends Component {
    state = {
        classTable: {},
        classesOfDay: [],
        selected_date: moment(),
        selected_week: 0,
        selected_weekDay: weekDays[moment().isoWeekday() - 1],
    }

    getWeek = () => {
        const termStart = moment(config.termStart, "YYYY-MM-DD");
        const selectedDay = moment(this.state.selected_date);     
        const actualWeek = Math.floor(selectedDay.diff(termStart, 'days') / 7) + 1;
        return actualWeek;
    }

    getInterval = (period) => {
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

    onSelect = async (selected_date) => {
        await this.setState({ selected_date });
        this.getClassesOfDay();        
    }

    getClassesOfDay = () => {
        const { classTable, selected_date } = this.state;
        const week = this.getWeek();
        
        let classesOfDay = [];
        if (week.toString() in config.holidays.weeks) {
            classesOfDay.push({
                holiday: config.holidays.weeks[week.toString()]
            });
        } else if (selected_date.format("YYYY-MM-DD") in config.holidays.days) {
            classesOfDay.push({
                holiday: config.holidays.days[selected_date.format("YYYY-MM-DD")]
            });
        } else {
            // Monday 0 -- Friday 4
            Object.keys(classTable).forEach((weekDay, index) => {
                if (index === selected_date.weekday()) {          
                    classesOfDay = classTable[weekDay].classes;
                }
            });
            classesOfDay = classesOfDay.filter(Class => {
                return this.getInterval(Class.period).includes(week);
            })
        }
        this.setState({ 
            classesOfDay, 
            selected_week: week, 
            selected_weekDay: weekDays[moment(selected_date).isoWeekday() - 1] 
        }); 
    }

    refreshClass = (classTable) => {
        this.setState({ classTable });
        this.getClassesOfDay();
    }

    async componentDidMount() {
        const classes = localStorage.getItem('classes') || sessionStorage.getItem('classes');
        if (!classes) return;
        await this.setState({ classTable: JSON.parse(classes) })
        this.getClassesOfDay();
    }

    render() {
        const { classesOfDay, selected_week, selected_weekDay } = this.state;
        return (
            <div>
                <Navbar onRefresh={this.refreshClass}/>
                <div className="classpanel">
                    <CalendarView onSelect={this.onSelect} />
                    {((selected_week >= 1 && selected_week <= 16) || typeof(selected_week) === 'string') &&
                        <Divider className="week-indicator">Week {selected_week} <span className="weekDay-indicator"> {selected_weekDay}</span></Divider>
                    }
                    <ClassList classes={classesOfDay} />
                </div>
            </div>   
        );
    }
}

export default ClassPanel;