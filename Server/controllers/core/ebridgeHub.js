var scraper = require('./scraper');
var parseTable = require('./parseTable');
var makeiCalendar = require('./makeiCalendar');

class ebridgeHub {
    constructor({uname, psw, io}) {
        this.uname = uname;
        this.psw = psw;
        this.io = io;
    }

    async login() {
        const { portal, jar } = await scraper.login({ uname: this.uname, psw: this.psw, io: this.io });
        this.portal = portal;
        this.jar = jar;
    }

    async getClass() {
        // console.log(this.portal);
        const table = await scraper.getTimetable({ portal: this.portal, jar: this.jar, io: this.io });
        const classTable = parseTable(table);
        this.classTable = classTable;
        
        return classTable;
    }

    makeCalendar() {
        return makeiCalendar({ class_table: this.classTable, uname: this.uname, io: this.io });
    }
}

module.exports = ebridgeHub;