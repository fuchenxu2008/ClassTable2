var express = require('express');
var router = express.Router();
var ebridgeController = require('../controllers/EbridgeController');

router.post('/class', ebridgeController.getClass);
router.get('/download', ebridgeController.downloadCalendar);
router.post('/count', ebridgeController.getDownloads);
router.get('/chart', ebridgeController.showChart);

module.exports = router;