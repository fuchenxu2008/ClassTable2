const cheerio = require('cheerio');

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function initializeTable() {
    // ClassTable
    var classTable = {}
    weekDays.forEach(weekday => {
        classTable[weekday] = {
            colspan: 1,
            classes: []
        }
    });
    return classTable;
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

function calcuEndTime(start) {
    const time = start.split(':')
    var h = time[0],
        m = time[1];
    m == '00' ? m = '30' : (m = '00', h = (parseInt(h) + 1).toString())
    return `${h}:${m}`
}

function getColsForDay(day, timeNodeElement, $, classTable) {
    // Calculate the interval columns for the weekday
    var start = weekDays.slice(0, weekDays.indexOf(day)).reduce((total, day) => total + classTable[day].colspan, 0)
    var end = start + classTable[day].colspan;
    return $(timeNodeElement).siblings().toArray().slice(start, end);
}

module.exports = function parseTable(table) {
    // ClassTable
    var classTable = initializeTable();
    var $ = cheerio.load(table);
    // Iterating weekdays
    weekDays.forEach((day, index) => {
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
            var timeNodeElement = $('td').filter(function () {
                return $(this).text() === timeNode
            }).get(0)
            // Grids at single time node in one weekday
            var colsForDay = getColsForDay(day, timeNodeElement, $, classTable);
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
                        moduleCode: $(classInfo.get(0)).text().substring(0, 6),
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
        classesOfDay.forEach(Class => {
            const logo = getLogo(Class.moduleCode, Class.classTitle);
            Class.classTitle = `${logo} ${Class.classTitle}`;
        });
        classTable[day].classes = classesOfDay;
    });

    return classTable;
}

function getLogo(code, title) {
    var logo = '📚';
    if (title.toLowerCase().includes('tutorial')) logo = '👨🏻‍🏫'
    else if (title.toLowerCase().includes('seminar')) logo = '👨🏻‍💻'
    else if (title.toLowerCase().includes('lab')) logo = '🔬'
    else {
        if (code.includes('ARC')) logo = '🏛'
        else if (code.includes('BIO')) logo = '🐳'
        else if (code.includes('CHE')) logo = '⚗️'
        else if (code.includes('CCS')) logo = '🇨🇳'
        else if (code.includes('CCT')) logo = '🗺'
        else if (code.includes('CEN')) logo = '🏠'
        else if (code.includes('CSE')) logo = '🖥'
        else if (code.includes('EEE')) logo = '🚀'
        else if (code.includes('ENG')) logo = '📜'
        else if (code.includes('ENV')) logo = '🏖'
        else if (code.includes('IND')) logo = '🎨'
        else if (code.includes('ACF')) logo = '📈'
        else if (code.includes('ECO')) logo = '💵'
        else if (code.includes('MAN')) logo = '📇'
        else if (code.includes('CLT')) logo = '📖'
        else if (code.includes('EAP')) logo = '🎙'
        else if (code.includes('LAN')) logo = '📰'
        else if (code.includes('SPA')) logo = '🇪🇸'
        else if (code.includes('MTH')) logo = '📐'
        else if (code.includes('PHE')) logo = '🎾'
        else if (code.includes('DPH')) logo = '💉'
        else if (code.includes('COM')) logo = '🎬'
        else if (code.includes('CDE')) logo = '🛣'
    }
    return logo;
}