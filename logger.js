//const winston = require("winston");
import winston from "winston";
const { combine, timestamp, printf, colorize, errors } = winston.format;
//const WinstonCloudWatch = require("winston-cloudwatch");
import WinstonCloudwatch from "winston-cloudwatch";
//require("dotenv").config();

// Define your custom format with printf.
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create a logger instance
// const logger = winston.createLogger({
//   level: "info",
//   format: combine(timestamp(), errors({ stack: true }), myFormat),
//   transports: [
//     new winston.transports.Console({ format: combine(colorize(), myFormat) }),
//   ],
// });

const logger = winston.createLogger({
  level: "info", // Set the log level as needed
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "error.log/var/log/csye6225_stdOp.log",
      level: "combine",
    }),
    new winston.transports.File({
      filename: "/var/log/csye6225_error.log",
      level: "error",
    }),
  ],
});

export default logger;
