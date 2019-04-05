const dbConfig = require('./dbConfig');

const config = {
    mongoURL: process.env.MONGO_URL || `mongodb://${dbConfig.uname}:${dbConfig.psw}@${dbConfig.url}/${dbConfig.database}?authSource=admin`,
    port: process.env.PORT || 8080,
    secret: 'xjtlu215123'
}

module.exports = config;