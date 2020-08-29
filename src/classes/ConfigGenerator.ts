import { config } from "../config";

export class ConfigGenerator {
  forShareX(key: string) {
    return JSON.stringify({
      Version: "13.1.0",
      Name: "micro",
      DestinationType: "ImageUploader, TextUploader, FileUploader",
      RequestMethod: "POST",
      RequestURL: config.host + "/upload",
      Body: "MultipartFormData",
      FileFormName: "file",
      URL: "$json:url$",
      ThumbnailURL: "$json:thumbnail_url$",
      DeletionURL: "$json:deletion_url$",
      Headers: {
        Authorization: key,
      },
    });
  }
}
