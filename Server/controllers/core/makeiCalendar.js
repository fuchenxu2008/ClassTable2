const eventManager = require('./scraper');
const ics = require('./ics.js');
const moment = require('moment');
const fs = require('fs');

var cal = ics();
const termInfo = JSON.parse(fs.readFileSync(__dirname + '/term.config.json'));
var classTable;

eventManager.on('makeiCalendar', class_table => {
    classTable = class_table;
    Object.keys(classTable).forEach(weekday => {
        classTable[weekday].classes.forEach(Class => {
            addClassToCal(Class);
        });
    })
    termInfo.holidays.days.forEach(holiday => {
        var holidayStart = moment(Object.keys(holiday)[0]).toDate();
        cal.addEvent(`${holiday[Object.keys(holiday)[0]]} 🎉`, `🎉🎉🎉`, '', holidayStart, holidayStart);        
    });
    termInfo.holidays.weeks.forEach(holiweek => {
        var holiweekStart = moment(termInfo.termStart).add(parseInt(Object.keys(holiweek)[0] - 1), 'week').toDate();
        var holiweekEnd = moment(holiweekStart).add('5', 'day').toDate();
        cal.addEvent(`${holiweek[Object.keys(holiweek)[0]]} 🚩`, `🚩🚩🚩`, '', holiweekStart, holiweekEnd);
    });
    fs.writeFile('cal.ics', cal.build(), (err) => {
        if (err) throw err;
        console.log('Calendar Saved');
    })
})

function addClassToCal(Class) {
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
        cal.addEvent(`${Class.classTitle} by ${Class.lecturer}`, Class.period, Class.location, startDateTime, endDateTime, rrule);     
    })
}

// Get actual date from period
function getDateTime(weekDay, startWeek, timeNodes) {
    var weekdays = Object.keys(classTable);
    for (let index = 0; index < weekdays.length; index++) {
        if (weekDay === weekdays[index]) {
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
            timeInterval[start] = end;
        } else {
            timeInterval[start] = start;
        }
    });
    return timeInterval;
}