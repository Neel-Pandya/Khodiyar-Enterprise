import winston from "winston";

const isProduction = process.env.NODE_ENV === "production";

const logger = winston.createLogger({
    level: isProduction ? "info" : "debug",

    format: isProduction
        ? winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json()
        )
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),

            // capture metadata
            winston.format.metadata({ fillExcept: ["message", "level", "timestamp", "stack"] }),

            winston.format.printf(({ timestamp, level, message, stack, metadata }) => {
                const meta = Object.keys(metadata).length
                    ? ` ${JSON.stringify(metadata)}`
                    : "";

                return `${timestamp} [${level}]: ${stack || message}${meta}`;
            })
        ),

    transports: [
        new winston.transports.Console(),

        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),

        new winston.transports.File({
            filename: "logs/combined.log",
        }),
    ],
});

export default logger;