const dbConfig = require('./dbConfig');

const config = {
    mongoURL: process.env.MONGO_URL || `mongodb://${dbConfig.uname}:${dbConfig.psw}@${dbConfig.url}/${dbConfig.database}`,
    port: process.env.PORT || 3001,
    secret: 'xjtlu215123'
}

module.exports = config;