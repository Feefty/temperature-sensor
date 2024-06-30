import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, timestamp, colorize, printf } = format;

const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};

const getCallerInfo = () => {
    const stack = new Error().stack?.split('\n')[3];
    const stackParts = stack?.trim().split(' ');
    const callerInfo = stackParts ? stackParts[stackParts.length - 1].replace(/\(|\)/g, '') : '';
    const [filePath, lineNumber] = callerInfo.split(':');
    const fileName = path.basename(filePath);
    return `${fileName}:${lineNumber}`;
};

const Logger = createLogger({
    level: level(),
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        colorize({ all: true }),
        printf((info) => {
            const callerInfo = getCallerInfo();
            return `${info.timestamp} ${info.level}: ${info.message} [${callerInfo}]`;
        }),
    ),
    transports: [
        new transports.Console()
    ],
});

export default Logger;
