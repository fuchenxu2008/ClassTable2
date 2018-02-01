var scraper = require('./scraper');
var parseTable = require('./parseTable');
var makeiCalendar = require('./makeiCalendar');

class ebridgeHub {
    constructor({uname, psw}) {
        this.uname = uname;
        this.psw = psw;
    }

    async login(res) {
        const { portal, jar } = await scraper.login({ uname: this.uname, psw: this.psw }, res);
        this.portal = portal;
        this.jar = jar;
    }

    async getClass() {
        // console.log(this.portal);
        const table = await scraper.getTimetable({ portal: this.portal, jar: this.jar });
        const classTable = parseTable(table);
        this.classTable = classTable;
        
        return classTable;
    }

    makeCalendar() {
        return makeiCalendar({ class_table: this.classTable, uname: this.uname });
        // return makeiCalendar({ classTable: '', uname: 'steve' });
    }
}

module.exports = ebridgeHub;