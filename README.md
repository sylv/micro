# micro

Another private file host. This is all still a work in progress so for now watch from a safe distance with safety glasses on and don't try anything you're about to see at home. At some point there will be more instructions on development and deployment, but now is not that moment.

<table>
  <tr>
    <td><img src="https://i.imgur.com/9OG82jM.png" title="Preview" alt="Preview"></td>
    <td><img src="https://i.imgur.com/21rYxiu.png" title="Preview" alt="Preview"></td>
   </tr> 
  </tr>
  <tr>
    <td><img src="https://i.imgur.com/WJ72q4q.png" title="Preview" alt="Preview"></td>
    <td><img src="https://i.imgur.com/8gjY8FK.png" title="Preview" alt="Preview"></td>
   </tr> 
  </tr>
</table>

## features

- [x] ShareX Support
- [x] Thumbnails
- [x] Config generation
- [x] File name preservation
- [x] Video, image and text previews
- [x] Syntax highlighting for supported files
- [x] Deletion URLs
- [x] Dashboard
- [x] Permissions
- [x] Invite links
- [x] URL Shortening
- [X] Mobile support
- [ ] EXIF metadata removal
- [ ] Video thumbnails
- [ ] Markdown previews
- [ ] Pastes

## todo

- [ ] Thumbnails should ideally be generated on upload
- [ ] Re-enable EXIF remover
- [ ] Image width+height should be stored so the image preview doesn't flash while loading.
- [ ] Ratelimiting
- [ ] Link shortening might be broken..?
- [ ] FileEmbed.tsx has trouble scaling down on mobile. May be due to the file name not truncating properly, also an issue with text previews that are long and wide.
- [ ] Domain dropdown should be a multi-select like the pre-tailwind design.