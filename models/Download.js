var mongoose = require('mongoose');

var DownloadSchema = mongoose.Schema({
    username: String,
    token: String,
    time: Date,
    platform: String,
    status: String
});

var Download = mongoose.model('Download', DownloadSchema);

module.exports = Download;