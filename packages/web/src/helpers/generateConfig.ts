export function generateConfig(token: string, domain: string) {
  const host = window.location.host;
  const protocol = window.location.protocol;
  const upload = `${protocol}//${host}/api/upload`;

  return JSON.stringify({
    Version: "13.2.1",
    Name: `micro - ${domain}`,
    DestinationType: "ImageUploader, TextUploader, FileUploader, URLShortener",
    RequestMethod: "POST",
    RequestURL: upload,
    Body: "MultipartFormData",
    FileFormName: "file",
    // todo: you should be able to choose between using view and download during config generation
    URL: "$json:view$",
    ThumbnailURL: "$json:thumbnail$",
    DeletionURL: "$json:delete$",
    Parameters: {
      input: "$input$",
    },
    Headers: {
      Authorization: token,
      "X-Micro-Host": domain,
    },
  });
}
