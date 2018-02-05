var scraper = require('./scraper');
var parseTable = require('./parseTable');
var makeiCalendar = require('./makeiCalendar');

class ebridgeHub {
    constructor({uname, psw, socketId, io}) {
        this.user = { uname, psw };
        this.socket = { id: socketId, io };
    }

    async login() {
        const { portal, jar } = await scraper.login({ 
            user: this.user, socket: this.socket
        });
        this.portal = portal;
        this.jar = jar;
    }

    async getClass() {
        const table = await scraper.getTimetable({ 
            portal: this.portal, jar: this.jar, socket: this.socket
        });
        const classTable = parseTable(table);
        this.classTable = classTable;
        return classTable;
    }

    makeCalendar() {
        return makeiCalendar({ 
            class_table: this.classTable, user: this.user, socket: this.socket
        });
    }
}

module.exports = ebridgeHub;