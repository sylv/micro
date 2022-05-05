export interface GeneratedConfig {
  name: string;
  content: string;
}

export function generateConfig(token: string, hosts: string[], direct: boolean): GeneratedConfig {
  const host = window.location.host;
  const protocol = window.location.protocol;
  const upload = `${protocol}//${host}/api/file`;
  const joined = hosts.join(", ");
  const name = `micro - ${joined}.sxcu`;
  const content = {
    Version: "13.2.1",
    Name: `micro - ${joined}`,
    DestinationType: "ImageUploader, TextUploader, FileUploader",
    RequestMethod: "POST",
    RequestURL: upload,
    Body: "MultipartFormData",
    FileFormName: "file",
    URL: direct ? "$json:urls.direct$" : "$json:urls.view$",
    ThumbnailURL: "$json:urls.thumbnail$",
    DeletionURL: "$json:urls.delete$",
    Headers: {
      Authorization: token,
      "X-Micro-Host": joined,
    },
  };

  return {
    name: name,
    content: JSON.stringify(content, null, 2),
  };
}
