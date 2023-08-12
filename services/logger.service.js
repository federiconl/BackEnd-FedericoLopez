import dotenv from 'dotenv';
import winston from 'winston';


dotenv.config()
console.log(process.env.MODE)

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,    
        warning: 2,     
        info: 3,       
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'red',     
        warning: 'yellow',
        info: 'green',
        http: 'magenta',    
        debug: 'blue',
    }
}

const logger = winston.createLogger({
    transports: [new winston.transports.Console({level: 'http'}),
    new winston.transports.File({level: 'warn', filename: './logs/errors.log'}),
]
});

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            // Este ejemplo nos permite ver una opción de aplicación de errores personalizados
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
    ]
});

const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({level: 'info'}),
        new winston.transports.File({level: 'warn', filename: './logs/errors.log'}),
    ]
});

export const addLogger = (req, res, next) => {

    req.logger = process.env.MODE === 'DEVEL' ? devLogger : prodLogger
    req.logger.error(`${req.method} ${req.url} ${new Date().toLocaleTimeString()}`)
    next();
};