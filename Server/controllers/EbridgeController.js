var ebridgeHub = require('./core/ebridgeHub');
var fs = require('fs');
const jwt = require('jsonwebtoken');
var moment = require('moment');
const config = require('../config');
var Download = require('../models/Download');

module.exports = {

    async getClass(req, res) {
        const io = req.app.get('socketio');
        const uname = req.body.uname;
        const psw = req.body.psw;
        const ebridgeSession = new ebridgeHub({
            uname,
            psw,
            io
        });
        try {
            await ebridgeSession.login();
        } catch (err) {
            return res.send(err);
        }
        const rawClass = await ebridgeSession.getClass();
        const iCalendar = ebridgeSession.makeCalendar();

        const token = jwt.sign(uname, config.secret);
        // Save token to download in db
        Download.create({
            token
        }, (err) => {
            if (err) return res.send(err);
            res.send({
                token
            });
        })
    },

    downloadCalendar(req, res) {
        // Authenticate token
        Download.findOne({
            token: req.params.token
        }, (err, download) => {
            if (err || !download) {
                return res.status(400).json({
                    message: 'Invalid token!!!'
                });
            }

            // Decode token, extract filename
            const username = jwt.verify(download.token, config.secret);
            // Download file
            const fileName = `${username}.ics`;
            const filePath = `${__root}/calendars/${fileName}`;
            var stats = fs.statSync(filePath);
            if (stats.isFile()) {
                console.log(`Sending file...`);
                res.set({
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': 'attachment; filename=' + fileName,
                    'Content-Length': stats.size
                });
                var stream = fs.createReadStream(filePath)
                stream.pipe(res);
                // and delete file
                stream.on('close', () => {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log('Failed to delete file.');
                        }
                    });
                })
            } else {
                return res.end(404);
            }

            // Log download, destroy old token in DB
            download.username = username;
            download.token = undefined;
            download.time = moment().format('YYYY-MM-DD hh:mm:ss');
            download.save((err) => {
                if (err) {
                    return res.status(400).send('Something went wrong...')
                }
            });
        })
    }

}