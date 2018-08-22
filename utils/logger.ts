import * as winston from 'winston';

export let logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            colorize: true,
            timestamp: false,
            prettyPrint: true,
        }),
        new winston.transports.File({
            level: 'debug',
            filename: '../out/tests/e2e/debug.log',
            timestamp: true
        })
    ]
});
export default logger;

winston.config.syslog.levels