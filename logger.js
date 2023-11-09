//const winston = require("winston");
import winston from "winston";
const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

export const logger = winston.createLogger({
  level: "info", // Set the log level as needed
  format: winston.format.combine(
    winston.format.timestamp(),
    colorize(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "/var/log/csye6225.log",
    }),
  ],
});

export const logger_err = winston.createLogger({
  level: "info", // Set the log level as needed
  format: winston.format.combine(
    winston.format.timestamp(),
    colorize(),
    logFormat
  ),
  transports: [
    new winston.transports.File({
      filename: "/var/log/csye6225err.log",
    }),
  ],
});

// module.exports = { logger, logger_err };
