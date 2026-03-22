import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';

// Daily rotate transport for error logs
const errorRotateTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m', // Rotate if file exceeds 20MB
  maxFiles: '14d', // Keep logs for 14 days
  zippedArchive: true, // Compress old logs
});

// Daily rotate transport for combined logs
const combinedRotateTransport = new DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m', // Rotate if file exceeds 20MB
  maxFiles: '30d', // Keep logs for 30 days
  zippedArchive: true, // Compress old logs
});

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: isProduction
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      )
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.metadata({
          fillExcept: ['message', 'level', 'timestamp', 'stack'],
        }),
        winston.format.printf(
          ({ timestamp, level, message, stack, metadata }) => {
            const meta = Object.keys(metadata).length
              ? ` ${JSON.stringify(metadata)}`
              : '';
            return `${timestamp} [${level}]: ${stack || message}${meta}`;
          }
        )
      ),
  transports: [
    new winston.transports.Console(),
    errorRotateTransport,
    combinedRotateTransport,
  ],
});

// Combined stream for Morgan
logger.stream = {
  write: (message) => {
    const msg = message.trim();
    const statusCode = msg.split(' ')[2];

    if (statusCode >= 500) {
      logger.error(msg);       // Server errors
    } else if (statusCode >= 400) {
      logger.warn(msg);        // Client errors
    } else {
      logger.info(msg);        // Success requests
    }
  },
};

export default logger;
