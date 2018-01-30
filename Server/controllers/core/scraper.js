var request = require('request');
const cheerio = require('cheerio');
const EventEmitter = require('events');
const fs = require('fs');

// Enable CookieJar
var request = request.defaults({jar: true});
// Event Manager
const eventManager = new EventEmitter();
module.exports = eventManager;

function login() {
    // Get form data and cookie
    request('https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/siw_lgn', (err, res, body) => {
        var $ = cheerio.load(body);
        const rawform = $('form').serializeArray();
        var formData = {}
        rawform.forEach(input => {
            formData[input['name']] = input['value']
        });
        formData['MUA_CODE.DUMMY.MENSYS.1'] = 'fanrui.min15'
        formData['PASSWORD.DUMMY.MENSYS.1'] = 'GCRUAPI'
        formData['BP101.DUMMY_B.MENSYS.1'] = 'Log in';
        console.log('Logging in...');
        // Post form to log in to intermediate page
        request.post('https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/siw_lgn',  {form: formData}, (err,httpResponse,body) => { 
            $ = cheerio.load(body);
            var redirectURL = $('#siw_portal_url').val();
            console.log('Redirecting to Portal...');          
            // Redirect to portal home page
            request(`https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/${redirectURL}`, (err, res, body) => {
                eventManager.emit('loggedIn', body);
                console.log('Successfully logged in!');
            })
        })
    })
}

function getTimetable(page) {
    var $ = cheerio.load(page);
    var timeTablePageURL = $('#TIMETABLE').attr('href');
    request(`https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/${timeTablePageURL}`, (err, res, body) => {
        $ = cheerio.load(body);
        const timeTableURL = $('a:contains("My Personal Class Timetable")').attr('href').substring(7);
        request(`https://ebridge.xjtlu.edu.cn/urd/sits.urd/run/${timeTableURL}`, (err, res, body) => {
            eventManager.emit('gotClass', body);
            fs.writeFile('./table.html', body);
        })
    })
}

// login();
fs.readFile('./table.html', (err, data) => {
    eventManager.emit('gotClass', data);
})

eventManager.on('loggedIn', (portal) => {
    getTimetable(portal); 
})

// ClassTable
var classTable = {
    Monday: {
        colspan: 1,
        classes: [
            {
                startTime: '',
                endTime: '',
                moduleCode: '',
                classTitle: '',
                Lecturer: '',
                Location: '',
                period: ''
            }
        ]
    },
    Tuesday: {
        colspan: 2,
        classes: []
    },
    Wednesday: {
        colspan: 3,
        classes: []
    },
    Thursday: {
        colspan: 4,
        classes: []
    },
    Friday: {
        colspan: 5,
        classes: []
    }
}

// Get Time Nodes
const timeSet = (function setTimeNodes() {
    var timeSet = []
    for (let h = 9; h < 20; h++) {
        for (let m of ['00', '30']) {
            timeSet.push(h + ':' + m)
        }
    }
    return timeSet;
})();

function isArray(o){
    return Object.prototype.toString.call(o)=='[object Array]';
}

eventManager.on('gotClass', (table) => {
    var $ = cheerio.load(table);
    // Iterating weekdays
    Object.keys(classTable).forEach((day, index) => {
        // Index is weekday-1
        // console.log(`Traversing index ${index} of classTable`);
        // How many columns in one weekday
        var colspan = parseInt($(`td:contains(${day})`).attr('colspan'));
        if (isNaN(colspan)) {
            colspan = 1;
        }
        classTable[day].colspan = colspan;
        // Set row count for grid iteration
        var row = 0;
        // Set classes array of current weekday
        var classesOfDay = []
        // Set grid view of the table
        var classGrid = {}
        // Iterating time nodes
        timeSet.forEach(timeNode => {
            // console.log(`Traversing time ${timeNode} of ${day}`);
            // the time title column
            var timeNodeElement = $('td').filter(function() { 
                return $(this).text() === timeNode
            }).get(0)
            // Grids at single time node in one weekday
            var colsForDay = getColsForDay(day, timeNodeElement, $);
            // Iterating each grid at the time node of the day
            colsForDay.forEach((grid, i) => {
                // If this grid contains a class
                if ($(grid).find('table').html() !== null) {
                    var classInfo = $(grid).find('table').find('td');
                    // Extract class info
                    var classInstance = {
                        weekDay: day,
                        startTime: timeNode,
                        endTime: calcuEndTime(timeNode),
                        moduleCode: $(classInfo.get(0)).text().substring(0,6),
                        classTitle: $(classInfo.get(0)).text(),
                        lecturer: $(classInfo.get(1)).text(),
                        location: $(classInfo.get(2)).text(),
                        period: $(classInfo.get(3)).text()
                    }
                    // Core Logic
                    var key = { row: row, col: i };
                    if (classGrid[key.row] === undefined) {
                        classGrid[key.row] = {}
                    }
                    // If class list is empty, simply add the class, else do below
                    if (classesOfDay.length > 0) {
                        // If it's the first row, add the class, else do below
                        if (row > 0) {
                            // Try to merge with grid above (adjacent ones can't be the same class)
                            var preKey = { row: row - 1, col: i };
                            // In case it is undefined
                            if (classGrid[preKey.row] === undefined) {
                                classGrid[preKey.row] = {}
                            }
                            // If upper row has classes
                            if (preKey.row in classGrid) {
                                var duplicateFound = false;
                                // Iterate each col in the row to check if there is class to be merged
                                Object.keys(classGrid[preKey.row]).forEach(col => {
                                    var preIndex = classGrid[preKey.row][col];
                                    if (classesOfDay[preIndex].classTitle === classInstance.classTitle) {
                                        classesOfDay[preIndex].endTime = calcuEndTime(timeNode);
                                        // Point the identifier to the grid with same class
                                        classGrid[key.row][key.col] = classGrid[preKey.row][col];
                                        duplicateFound = true;
                                    }
                                })
                                if (!duplicateFound) {
                                    classesOfDay.push(classInstance)
                                    classGrid[key.row][key.col] = classesOfDay.length - 1
                                }
                            } else {
                                classesOfDay.push(classInstance)
                                classGrid[key.row][key.col] = classesOfDay.length - 1
                            }
                        } else {
                            classesOfDay.push(classInstance)
                            classGrid[key.row][key.col] = classesOfDay.length - 1
                        }
                    } else {
                        classesOfDay.push(classInstance)
                        classGrid[key.row][key.col] = classesOfDay.length - 1
                    }
                }
            });
            row += 1;
        }); 
        classTable[day].classes = classesOfDay;
    });
    eventManager.emit('makeiCalendar', classTable);
})

function calcuEndTime(start) {
    const time = start.split(':')
    var h = time[0],
        m = time[1];
    m == '00' ? m = '30' : (m = '00', h = (parseInt(h) + 1).toString())
    return `${h}:${m}`
}

function getColsForDay(day, timeNodeElement, $) {
    // Calculate the interval columns for the weekday
    var start = Object.keys(classTable).slice(0, Object.keys(classTable).indexOf(day)).reduce((total, day) => total + classTable[day].colspan, 0)
    var end = start + classTable[day].colspan;
    return $(timeNodeElement).siblings().toArray().slice(start, end);
}