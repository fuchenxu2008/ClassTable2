const ics = require('./ics.js');
const moment = require('moment');
const fs = require('fs');

const termInfo = JSON.parse(fs.readFileSync(__dirname + '/term.config.json'));

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

module.exports = function makeiCalendar({class_table, user, socket}) {
    socket.io.emit(socket.id, '2');
    var cal = ics();
    var classTable = class_table;
    weekDays.forEach(weekday => {
        classTable[weekday].classes.forEach(Class => {
            addClassToCal(Class, cal);
        });
    })
    termInfo.holidays.days.forEach(holiday => {
        var holidayStart = moment(Object.keys(holiday)[0]).toDate();
        cal.addEvent(`🎉 ${holiday[Object.keys(holiday)[0]]}`, `🎉🎉🎉`, '', holidayStart, holidayStart);        
    });
    termInfo.holidays.weeks.forEach(holiweek => {
        var holiweekStart = moment(termInfo.termStart).add(parseInt(Object.keys(holiweek)[0] - 1), 'week').toDate();
        var holiweekEnd = moment(holiweekStart).add('5', 'day').toDate();
        const eventName = holiweek[Object.keys(holiweek)[0]];
        const emoji = eventName === 'Midterm' ? '🚩' : '🎉';
        cal.addEvent(`${emoji} ${eventName}`, `${emoji}${emoji}${emoji}`, '', holiweekStart, holiweekEnd);
    });
    console.log('saving...');
    socket.io.emit(socket.id, 'Almost there...');
    
    const calendar = cal.build();
    
    fs.writeFileSync(`${__root}/calendars/${user.uname}.ics`, calendar);
    console.log('Calendar Saved');
    socket.io.emit(socket.id, '3');
    return calendar;
}

function addClassToCal(Class, cal) {
    const weekdic = getInterval(Class.period)
    Object.keys(weekdic).forEach(startWeek => {
        // get actual date time of class time
        var classTime = getDateTime(Class.weekDay, startWeek, { start: Class.startTime, end: Class.endTime });
        const startDateTime = classTime.start.toDate();
        const endDateTime = classTime.end.toDate();
        const endWeek = weekdic[startWeek];
        const repeatTime = endWeek - startWeek + 1;
        if (repeatTime > 1) {
            var rrule = {
                freq: 'WEEKLY',
                count: repeatTime,
            }
        }
        var classTitle = Class.classTitle.replace(',', '\\,');
        
        cal.addEvent(`${classTitle} by ${Class.lecturer.replace(',', '\\,')}`, Class.period, formatLocation(Class.location).replace(',', '\\,'), startDateTime, endDateTime, rrule);
    })
}

// Get actual date from period
function getDateTime(weekDay, startWeek, timeNodes) {
    for (let index = 0; index < weekDays.length; index++) {
        if (weekDay === weekDays[index]) {
            var days = index + (startWeek - 1) * 7;
            const dateTime = {
                start: moment(`${termInfo.termStart} ${timeNodes.start}`, "YYYY-MM-DD hh:mm").add(days, 'day'),
                end: moment(`${termInfo.termStart} ${timeNodes.end}`, "YYYY-MM-DD hh:mm").add(days, 'day')
            }
            return dateTime;
        }
    }
}

// Get week intervals
function getInterval(period) {
    var timeInterval = {}
    period = period.split(':')[1]
    const periods = period.split(',')
    periods.forEach(interval => {
        const startEnd = interval.split('-');
        const start = parseInt(startEnd[0]);
        if (startEnd.length > 1) {
            const end = parseInt(startEnd[1]);
            if (start >= 5 && end >= 5) {
                timeInterval[start + 1] = end + 1;
            } else if (start < 5 && end >= 5) {
                timeInterval[start] = 4;
                timeInterval[6] = end + 1;
            } else timeInterval[start] = end;
        } else {
            start >= 5
            ? timeInterval[start + 1] = start + 1
            : timeInterval[start] = start;
        }
    });
    return timeInterval;
}

function formatLocation(location) {
    return location.split(',').map(loc => loc.trim().split('-').reverse().join('-')).join(', ');
}