import AWS from "aws-sdk";
import { config } from "./config";

export const s3 = new AWS.S3({
  accessKeyId: config.s3.access_key,
  secretAccessKey: config.s3.secret_key,
  endpoint: config.s3.endpoint,
  s3ForcePathStyle: true, // minio wants this
  signatureVersion: "v4", // and this
});
