<p align="center">
   <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-primary">
      <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path>
      <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path>
   </svg>
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=vite,tailwind,nest,typescript,docker,graphql" />
  <br/>
  <a href="https://discord.gg/VDMX6VQRZm"><kbd>🔵 discord</kbd></a> <a href="https://micro.sylo.digital"><kbd>🟣 hosted instance</kbd></a>
</p>

# micro

A vanity file sharing service with support for ShareX. You can see a preview at https://micro.sylo.digital

- [micro](#micro)
  - [features](#features)
  - [screenshots](#screenshots)
  - [installation](#installation)
  - [development](#development)
  - [todo](#todo)
  - [support](#support)

## features

- [x] ShareX Support
- [x] Video and image thumbnails
- [x] Config generation
- [x] Encrypted pastes
- [x] File name preservation
- [x] Video, image, text and markdown previews
- [x] Syntax highlighting for supported files
- [x] Deletion URLs
- [x] Dashboard
- [x] Permissions
- [x] Invite links
- [x] URL Shortening
- [x] Mobile support
- [x] EXIF metadata removal
- [x] Conversions (GIF>WebM, WebP>PNG, etc.)
- [x] Purging of old and/or large files (`config.purge`).
- [x] 2FA support
- [X] Decay files to S3 to save space 

## screenshots

<table>
  <tr>
    <td><img src="https://i.imgur.com/YN5WXpz.png" title="Sign In Page" alt="Sign In Page"></td>
    <td><img src="https://i.imgur.com/lw0FlYR.png" title="Dashboard" alt="Dashboard"></td>
   </tr> 
  </tr>
  <tr>
    <td><img src="https://i.imgur.com/ybu4B8I.png" title="Upload Page" alt="Upload Page"></td>
    <td><img src="https://i.imgur.com/Ij7PElj.png" title="Text Preview" alt="Text Preview"></td>
   </tr> 
  </tr>
  <tr>
    <td><img src="https://i.imgur.com/1KUrtVf.png" title="Paste Page" alt="Paste Page"></td>
    <td><img src="https://i.imgur.com/GYaEcKy.png" title="2FA setup" alt="2FA setup"></td>
  </tr>
</table>

## installation

[See the `example` directory](./example) for how to setup micro.

## development

You can pull the repo and then `pnpm install`, after that everything should be good to go. You can start the `packages/api`/`packages/web` with `pnpm watch`.

## todo

- [ ] Ratelimiting
- [ ] Admin UI
- [ ] Deletion URLs for pastes/links
- [ ] Password recovery via emails
- [ ] SQLite support
- [ ] Private email aliases like firefox relay (might be difficult/expensive)

## support

<a href="https://discord.gg/VDMX6VQRZm" target="__blank">
  <img src="https://discordapp.com/api/guilds/778444719553511425/widget.png?style=banner2" alt="sylo.digital"/>
</a>
