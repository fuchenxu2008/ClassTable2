var mongoose = require('mongoose');
const timeZone = require('mongoose-timezone');

var DownloadSchema = mongoose.Schema({
    username: String,
    token: String,
    time: Date
});

DownloadSchema.plugin(timeZone);

var Download = mongoose.model('Download', DownloadSchema);

module.exports = Download;