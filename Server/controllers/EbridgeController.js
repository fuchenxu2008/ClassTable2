var ebridgeHub = require('./core/ebridgeHub');
var fs = require('fs');

module.exports = {

    async getClass(req, res) {
        const uname = req.body.uname;
        const psw = req.body.psw;
        const ebridgeSession = new ebridgeHub({ uname, psw });
        try {
            await ebridgeSession.login(res);
        } catch (err) {
            res.send(err);
            return;
        }
        const rawClass = await ebridgeSession.getClass();
        
        const iCalendar = ebridgeSession.makeCalendar();

        // res.send(iCalendar);
        res.send(`http://172.20.10.2:3001/ebridge/download/${uname}`);
    },

    downloadCalendar(req, res) {
        var fileName = `${req.params.fileToken}.ics`;
        var filePath = `${__root}/calendars/${fileName}`;
        var stats = fs.statSync(filePath);
        if (stats.isFile()) {
            console.log(`Sending file...`);
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename=' + fileName,
                'Content-Length': stats.size
            });
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.end(404);
        }
    }

}