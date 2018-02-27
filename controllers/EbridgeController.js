var ebridgeHub = require('./core/ebridgeHub');
var fs = require('fs');
const jwt = require('jsonwebtoken');
var moment = require('moment');
const config = require('../config');
const Download = require('../models/Download');
const Visit = require('../models/Visit');
const sendEmail = require('../controllers/email');

module.exports = {

    async getClass(req, res) {
        const io = req.app.get('socketio');
        let uname = req.body.uname;
        const psw = req.body.psw;
        const socketId = req.body.socketId;
        if (!uname || !psw || !socketId) {
            return res.status(400).json({
                message: 'Missing body content!!!'
            })
        }
        uname = uname.toLowerCase();        
        const ebridgeSession = new ebridgeHub({ uname, psw, socketId, io });

        let rawClass = {};
        try {
            await ebridgeSession.login();
            rawClass = await ebridgeSession.getClass();
        } catch (err) {
            return res.json({ message: err });
        }

        let download = new Download({
            username: uname,
            time: moment().format('YYYY-MM-DD hh:mm:ss')
        });

        let token = '';

        if (req.query.download) {
            download.platform = 'Web';
            if (req.query.download === '0') {
                console.log('want refresh');
                download.status = 'completed';
            } else if (req.query.download === '1') {
                const iCalendar = ebridgeSession.makeCalendar();

                if (req.body.email) {
                    console.log(`want email to ${req.body.email}`);
                    sendEmail(req.body.email, uname);
                    download.status = 'completed';
                } else {
                    console.log('want download');
                    // Save token to download in db
                    token = jwt.sign({ uname }, config.secret, { expiresIn: '1m' });
                    download.token = token;
                    download.status = 'pending';
                } 
            }
        } else {
            console.log('no download or email');
            download.platform = 'WeChat';
            download.status = 'completed';
        }
        
        download.save((err) => {
            if (err) return res.status(400).send(err);
            if (req.query.download && !req.body.email) return res.send({ token, rawClass });
            else return res.send({ rawClass });
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
            try {
                let { uname } = jwt.verify(download.token, config.secret);
                // Download file
                const fileName = `${uname}.ics`;
                const filePath = `${__root}/calendars/${fileName}`;
                var stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    console.log(`Sending file...`);
                    res.download(filePath, fileName, (err) => {
                        if (err) {
                            return res.status(400).json({ message: 'Something went wrong...' })
                        } else {
                            console.log('Operation completed.');
                        }
                    })
                } else {
                    return res.end(404);
                }

                // Log download, destroy old token in DB
                download.status = 'completed';
                download.save((err) => {
                    if (err) return res.status(400).send('Something went wrong...');
                });
            } catch (error) {
                return res.status(400).json({
                    message: 'Invalid token!!!'
                });
            }   
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
    },

    showChart(req, res) {
        Download.find({}, (err, users) => {
            const formattedUsers = users.map(user => {
                return {
                    user: user.username,
                    platform: user.platform,
                    time: user.time,
                    status: user.status
                }
            });
            res.json(formattedUsers);
        })
    }

}