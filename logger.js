import winston from 'winston';

const customLevels = {
    levels: {
        debug: 0,
        info: 1,
        express: 2,
        mail: 3,
        couchbase: 4,
        sql: 5,
        security: 6,
        blacklist: 7,
        warning: 8,
        error: 9
    }
};

const logger = winston.createLogger({
    level: process.env.NODE_ENV != 'development' ? 'warning' || 'error' : '',
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

export default logger;