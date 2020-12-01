const { v4: uuidv4 } = require('uuid');
module.exports = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    db: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
    },
    secret: process.env.SESSION_SECRET || uuidv4(),
    sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE) || null
};
