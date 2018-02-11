import React, { Component } from 'react';
import moment from 'moment';

import './CalendarView.css';
import { Calendar } from 'antd';

moment.locale('zh-cn', {
    week: {
        dow: 1 // Monday is the first day of the week
    }
});

class CalendarView extends Component {
    state = {
        value: moment(),
        selectedValue: moment(),
    }

    onSelect = (value) => {
        this.setState({
            value,
            selectedValue: value,
        });
        this.props.onSelect(value);
    }
    onPanelChange = (value) => {
        this.setState({ value });
    }

    render() {
        return (
            <div className="calendar-selector">
                <Calendar fullscreen={false} onSelect={this.onSelect} onPanelChange={this.onPanelChange} />
            </div>
        );
    }
}

export default CalendarView;