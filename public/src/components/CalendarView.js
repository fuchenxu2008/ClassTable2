import React, { Component } from 'react';
import moment from 'moment';
import { Calendar } from 'antd';

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
    }
    onPanelChange = (value) => {
        this.setState({ value });
    }

    render() {
        return (
            <div style={{ width: '100%', border: '1px solid #d9d9d9', borderRadius: 4 }}>
                <Calendar fullscreen={false} onSelect={this.onSelect} onPanelChange={this.onPanelChange} />
                <button onClick={() => console.log(this.state)}>Show State</button>    
            </div>
        );
    }
}

export default CalendarView;