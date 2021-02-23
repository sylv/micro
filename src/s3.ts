import AWS from "aws-sdk";
import { config } from "./config";

export const s3 = new AWS.S3(config.storage);
