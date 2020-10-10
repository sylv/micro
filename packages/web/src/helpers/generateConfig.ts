export function generateConfig(token: string, domain: string) {
  const host = window.location.host;
  const protocol = window.location.protocol;
  const upload = `${protocol}//${host}/api/upload`;

  return JSON.stringify({
    Version: "13.2.1",
    Name: `micro - ${domain}`,
    DestinationType: "ImageUploader, TextUploader, FileUploader",
    RequestMethod: "POST",
    RequestURL: upload,
    Body: "MultipartFormData",
    FileFormName: "file",
    URL: "$json:download_url$",
    ThumbnailURL: "$json:thumbnail_url$",
    DeletionURL: "$json:deletion_url$",
    Headers: {
      Authorization: token,
      "X-Micro-Host": domain,
    },
  });
}
