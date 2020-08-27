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
      maxsize: config.maxErrorLogSize,
    }),
    new winston.transports.File({
      filename: "combined.log",
      dirname: "logs",
      maxsize: config.maxCombinedLogSize,
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

if (process.env.NODE_ENV !== "production" || process.env.VERBOSE === "true") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
