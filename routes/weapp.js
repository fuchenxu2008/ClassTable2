var express = require('express');
var router = express.Router();
var weappController = require('../controllers/weappController');

router.post('/onLogin', weappController.onLogin);

router.post('/sendNoti', weappController.sendNotification);

module.exports = router;