var express = require('express');
var router = express.Router();
var ebridgeController = require('../controllers/EbridgeController');
var io = require('../app').io;

router.post('/class', ebridgeController.getClass);

router.get('/download/:token', ebridgeController.downloadCalendar);

router.get('/socket', (req, res) => {
    var io = req.app.get('socketio');
    io.emit('ack', 'hi!');
})

module.exports = router;