import { Injectable, PayloadTooLargeException, NotFoundException } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { FastifyReply } from "fastify";
import { config } from "../config";
import { s3 } from "../s3";

@Injectable()
export class S3Service {
  public async getObjectStream(key: string) {
    return s3.getObject({ Key: key, Bucket: config.storage.bucket }).createReadStream();
  }

  public sendObject(key: string, reply: FastifyReply) {
    return new Promise((resolve, reject) => {
      const stream = s3
        .getObject({ Key: key, Bucket: config.storage.bucket })
        .on("httpHeaders", (statusCode, headers) => {
          if (statusCode >= 300) {
            return;
          }

          reply.header("Last-Modified", headers["last-modified"]);
          reply.header("Content-Length", headers["content-length"]);
          reply.header("Content-Type", headers["content-type"]);
          reply.header("Content-Disposition", headers["content-disposition"]);
          reply.header("ETag", headers["etag"]);
          reply.send(stream);
        })
        .createReadStream()
        .on("end", resolve)
        .on("error", (err: any) => {
          switch (err.code) {
            case "NoSuchKey":
              return reject(new NotFoundException());
            default:
              return reject(err);
          }
        });
    });
  }

  /**
   * Upload a file to S3 with config.uploadLimit enforced
   * You should check Content-Length and throw your own
   * error if exceeded as this cannot do that for you.
   * @throws PayloadTooLargeException
   * @returns the size of the upload
   */
  public async createObject(
    stream: NodeJS.ReadableStream,
    options: Partial<S3.PutObjectRequest> & { Key: string }
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const uploadOptions = Object.assign(options, { Bucket: config.storage.bucket, Body: stream });
      const upload = s3.upload(uploadOptions);
      let size = 0;

      stream.on("error", reject);
      stream.on("data", (chunk) => {
        size += chunk.length;
        if (size > config.uploadLimit) {
          upload.abort();
          reject(new PayloadTooLargeException());
        }
      });

      upload
        .promise()
        .then(() => resolve(size))
        .catch(reject);
    });
  }
}
