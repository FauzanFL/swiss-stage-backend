import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.printf(
  ({ level, message, timestamp, context, stack }) => {
    const stackTrace = stack ? `\n${stack}` : '';
    const ctx = context ? `[${context}]` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${ctx}: ${message} ${stackTrace}`;
  },
);

export const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        logFormat,
      ),
    }),

    new DailyRotateFile({
      filename: 'logs/%DATE%-swiss-stage.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        logFormat,
      ),
    }),

    new DailyRotateFile({
      filename: 'logs/%DATE%-swiss-stage-error.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
      handleExceptions: true,
      handleRejections: true,
      format: winston.format.combine(winston.format.timestamp(), logFormat),
    }),
  ],
});
