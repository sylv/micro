import { config } from "../config";
import url from "url";

export class ConfigGenerator {
  forShareX(key: string) {
    const domain = url.parse(config.host).hostname ?? config.host;
    return JSON.stringify({
      Version: "13.1.0",
      Name: `micro - ${domain}`,
      DestinationType: "ImageUploader, TextUploader, FileUploader",
      RequestMethod: "POST",
      RequestURL: config.host + "/upload",
      Body: "MultipartFormData",
      FileFormName: "file",
      URL: "$json:url$",
      ThumbnailURL: "$json:thumbnailUrl$",
      DeletionURL: "$json:deletionUrl$",
      Headers: {
        Authorization: key,
      },
    });
  }
}
