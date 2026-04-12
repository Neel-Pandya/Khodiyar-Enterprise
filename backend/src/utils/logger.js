import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';

/* ──────────────────────────────────────────────
   Formats
────────────────────────────────────────────── */

// Console (dev-friendly, colored)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

// File (structured JSON for production)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/* ──────────────────────────────────────────────
   Transports
────────────────────────────────────────────── */

// Error logs
const errorRotateTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '14d',
  zippedArchive: true,
  format: fileFormat,
});

// Combined logs
const combinedRotateTransport = new DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  zippedArchive: true,
  format: fileFormat,
});

/* ──────────────────────────────────────────────
   Logger
────────────────────────────────────────────── */

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  transports: [
    // ✅ Console (always for dev)
    new winston.transports.Console({
      format: consoleFormat,
    }),

    // ✅ File logs
    errorRotateTransport,
    combinedRotateTransport,
  ],
});

/* ──────────────────────────────────────────────
   Morgan Stream (FIXED)
────────────────────────────────────────────── */

logger.stream = {
  write: (message) => {
    const msg = message.trim();

    // Extract status code safely
    const parts = msg.split(' ');
    const statusCode = parseInt(parts[2], 10);

    if (!isNaN(statusCode)) {
      if (statusCode >= 500) {
        logger.error(msg);
      } else if (statusCode >= 400) {
        logger.warn(msg);
      } else {
        logger.info(msg);
      }
    } else {
      logger.info(msg);
    }
  },
};

export default logger;
