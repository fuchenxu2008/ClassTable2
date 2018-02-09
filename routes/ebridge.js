var express = require('express');
var router = express.Router();
var ebridgeController = require('../controllers/EbridgeController');

router.post('/class', ebridgeController.getClass);

router.get('/download/:token', ebridgeController.downloadCalendar);

router.post('/count', ebridgeController.getDownloads)

module.exports = router;