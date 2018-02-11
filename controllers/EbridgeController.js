var ebridgeHub = require('./core/ebridgeHub');
var fs = require('fs');
const jwt = require('jsonwebtoken');
var moment = require('moment');
const config = require('../config');
const Download = require('../models/Download');
const Visit = require('../models/Visit');


module.exports = {

    async getClass(req, res) {
        const io = req.app.get('socketio');
        const credential = jwt.verify(req.body.credentialToken, config.secret);
        const uname = credential.uname;
        const psw = credential.psw;
        const socketId = req.body.socketId;
        const ebridgeSession = new ebridgeHub({ uname, psw, socketId, io });

        let rawClass;
        try {
            await ebridgeSession.login();
            rawClass = await ebridgeSession.getClass();
        } catch (err) {
            return res.send(err);
        }
        const iCalendar = ebridgeSession.makeCalendar();

        const token = jwt.sign({ uname }, config.secret, { expiresIn: '1m' });
        // Save token to download in db
        Download.create({ token }, (err) => {
            if (err) return res.send(err);
            res.send({ token, rawClass });
        })
    },

    downloadCalendar(req, res) {
        // Authenticate token
        Download.findOne({
            token: req.query.token
        }, (err, download) => {
            if (err || !download) {
                return res.status(400).json({
                    message: 'Invalid token!!!'
                });
            }

            // Decode token, extract filename
            const { uname } = jwt.verify(download.token, config.secret);
            // Download file
            const fileName = `${uname}.ics`;
            const filePath = `${__root}/calendars/${fileName}`;
            var stats = fs.statSync(filePath);
            if (stats.isFile()) {
                console.log(`Sending file...`);
                res.download(filePath, fileName, (err) => {
                    if (err) {
                        return res.status(400).send('Something went wrong...')
                    } else {
                        // fs.unlink(filePath, (err) => {
                        //     if (err) {
                        //         console.log('Failed to delete file.');
                        //     }
                        //     console.log('Operation completed.');
                        // });
                        console.log('Operation completed.');
                    }
                })
                // res.set({
                //     'Content-Type': 'application/octet-stream',
                //     'Content-Disposition': 'attachment; filename=' + fileName,
                //     'Content-Length': stats.size
                // });
                // var stream = fs.createReadStream(filePath)
                // stream.pipe(res);
                // // and delete file
                // stream.on('close', () => {
                //     fs.unlink(filePath, (err) => {
                //         if (err) {
                //             console.log('Failed to delete file.');
                //         }
                //         console.log('Operation completed.');
                //     });
                // })
            } else {
                return res.end(404);
            }

            // Log download, destroy old token in DB
            download.username = uname;
            // download.token = undefined;
            download.time = moment().format('YYYY-MM-DD hh:mm:ss');
            download.save((err) => {
                if (err) {
                    return res.status(400).send('Something went wrong...')
                }
            });
        })
    },

    getDownloads(req, res) {
        const newVisit = req.body.newVisit;
        const userAgent = req.body.userAgent;
        if (newVisit) {
            Visit.create({
                userAgent, time: moment().format('YYYY-MM-DD hh:mm:ss')
            }, (err) => {
                if (err) console.log(err);
            })
        }
        Download.distinct('username', (err, users) => {
            if (err) { return res.status(400).send('Something went wrong...') }
            return res.json({ count: users.length });
        })
    }

}