# micro

Another private file host. This is all still a work in progress so for now watch from a safe distance with safety glasses on and don't try anything you're about to see at home. At some point there will be more instructions on development and deployment, but now is not that moment.

<table>
  <tr>
    <td><img src="https://i.imgur.com/1wKeCNj.png" title="Preview" alt="Preview"></td>
    <td><img src="https://i.imgur.com/zJoQX37.png" title="Preview" alt="Preview"></td>
   </tr> 
  </tr>
  <tr>
    <td><img src="https://i.imgur.com/uT5tYAB.png" title="Preview" alt="Preview"></td>
    <td><img src="https://i.imgur.com/TPbxZ7h.png" title="Preview" alt="Preview"></td>
   </tr> 
  </tr>
</table>

## features

- [x] ShareX Support
- [x] Thumbnails
- [x] Config generation
- [x] File name preservation
- [x] Video, image and text previews
- [x] Syntax highlighting on [supported](packages/web/src/components/FileContent/TextContent.tsx) [files](./packages/web/src/components/FileContent/TextContent.languages.ts)
- [x] Deletion URLs
- [x] Dashboard
- [x] Permissions
- [x] Invite links
- [x] URL Shortening
- [ ] Video thumbnails
- [ ] Markdown previews
- [ ] Mobile support
- [ ] Pastes

## todo

- [ ] Text viewer should dynamically import prism so the bundle size isnt hilariously large
- [ ] The annoying flash of light theme has returned and needs to be fixed, likely caused by a geist-ui update.
