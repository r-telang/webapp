//const winston = require("winston");
import winston from "winston";
const { combine, timestamp, printf, colorize, errors } = winston.format;
//const WinstonCloudWatch = require("winston-cloudwatch");
import WinstonCloudwatch from "winston-cloudwatch";
//require("dotenv").config();

// Define your custom format with printf.
const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Create a logger instance
const Logger = winston.createLogger({
  level: "info", // Set the default minimum level to log. Change this to debug for more verbose logging
  format: combine(
    timestamp(), // Add timestamp to each log
    errors({ stack: true }), // Ensure to log the stack trace if available
    myFormat // Custom format for log string
  ),
  transports: [
    // Default transport is console. It outputs the logs to the console.
    new winston.transports.Console({ format: combine(colorize(), myFormat) }),
  ],
});

// In production, write to a file and to CloudWatch, in addition to the console.
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  // if ('production' === 'production') {

  Logger.add(
    new winston.transports.File({ filename: "error.log", level: "error" })
  );
  Logger.add(new winston.transports.File({ filename: "combined.log" }));

  console.log("adding in log");
  // Configure CloudWatch transport

  Logger.add(
    new WinstonCloudwatch({
      logGroupName: "webapp-dev", // Replace with your log group
      logStreamName: "instance-01-error-logs1", // Replace with your log stream
      awsRegion: "us-east-1", // Replace with your AWS region
      jsonMessage: true,
    })
  );

  Logger.add(
    new WinstonCloudwatch({
      logGroupName: "webapp-dev",
      logStreamName: "instance-01-combined-logs1", // Use your specific log stream name for combined logs
      awsRegion: "us-east-1", // Ensure AWS_REGION is set in your environment variables
      jsonMessage: true,
    })
  );
}

module.exports = Logger;
