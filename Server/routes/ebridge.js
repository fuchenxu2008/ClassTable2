var express = require('express');
var router = express.Router();
var ebridgeController = require('../controllers/EbridgeController');

router.post('/class', ebridgeController.getClass);

router.get('/download/:fileToken', ebridgeController.downloadCalendar);

module.exports = router;