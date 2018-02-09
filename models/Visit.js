const mongoose = require('mongoose');

const VisitSchema = mongoose.Schema({
    userAgent: String,
    time: Date
});

let Visit = mongoose.model('Visit', VisitSchema);

module.exports = Visit;