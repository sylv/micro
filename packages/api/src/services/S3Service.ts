import { Injectable, NotFoundException, PayloadTooLargeException } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { FastifyReply } from "fastify";
import { config } from "../config";
import { s3 } from "../s3";

@Injectable()
export class S3Service {
  public async sendFile(key: string, reply: FastifyReply): Promise<void> {
    try {
      // todo: this buffers it all into memory but i swear to fucking god the aws-sdk library is complete
      // dogshit and refuses to let me get the headers as a promise and catch errors before returning
      // the stream and ive been trying to get it to work properly for like 5 hours and without going
      // complete spaghetti mode on the code its just not gonna work so im gonna leave this to future me
      // to fix and for now just break the rules and buffer it all in to memory. good luck cunt
      const object = await s3.getObject({ Key: key, Bucket: config.storage.bucket }).promise();
      reply.header("Last-Modified", object.LastModified);
      reply.header("Content-Length", object.ContentLength);
      reply.header("Content-Type", object.ContentType);
      reply.header("Content-Disposition", object.ContentDisposition);
      reply.header("ETag", object.ETag);
      await reply.send(object.Body);
    } catch (err) {
      switch (err.code) {
        case "NoSuchKey":
          throw new NotFoundException();
        default:
          throw err;
      }
    }
  }

  /**
   * Upload a file to S3 with config.uploadLimit enforced
   * You should check Content-Length and throw your own
   * error if exceeded as this cannot do that for you.
   * @throws PayloadTooLargeException
   * @returns the size of the upload
   */
  public async uploadFile(
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
