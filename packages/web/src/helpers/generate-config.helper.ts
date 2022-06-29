export interface GenerateConfigOptions {
  hosts: string[];
  token: string;
  direct: boolean;
  shortcut: boolean;
}

export function generateConfig(options: GenerateConfigOptions) {
  const host = window.location.host;
  const protocol = window.location.protocol;
  const upload = `${protocol}//${host}/api/file`;
  const joined = options.hosts.join(', ');
  const name = `micro - ${joined}.sxcu`;
  const content = {
    Version: '13.2.1',
    Name: `micro - ${joined}`,
    DestinationType: 'ImageUploader, TextUploader, FileUploader, URLShortener',
    RequestMethod: 'POST',
    RequestURL: upload,
    Body: 'MultipartFormData',
    FileFormName: 'file',
    URL: options.direct ? '$json:urls.direct$' : '$json:urls.view$',
    ThumbnailURL: '$json:urls.thumbnail$',
    DeletionURL: '$json:urls.delete$',
    Parameters: {
      input: '$input$',
    },
    Headers: {
      Authorization: options.token,
      'X-Micro-Paste-Shortcut': options.shortcut.toString(),
      'X-Micro-Host': joined,
    },
  };

  return {
    name: name,
    content: JSON.stringify(content, null, 2),
  };
}
