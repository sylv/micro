import winston from "winston";
import { config } from "./config";

export const LOGGER_LEVEL = process.env.NODE_ENV === "production" ? "info" : "debug";
export const logger = winston.createLogger({
  level: LOGGER_LEVEL,
  transports: [
    new winston.transports.File({
      filename: "error.log",
      dirname: "logs",
      level: "error",
      maxFiles: 1,
      maxsize: config.sizeLimits.errorLog,
    }),
    new winston.transports.File({
      filename: "combined.log",
      dirname: "logs",
      maxFiles: 1,
      maxsize: config.sizeLimits.combinedLog,
    }),
  ],
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    trace: 4,
    debug: 5,
  },
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);
