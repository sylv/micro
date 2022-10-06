# micro

An invite-only file sharing service with support for ShareX. You can see a preview at https://micro.sylo.digital

- [micro](#micro)
  - [features](#features)
  - [screenshots](#screenshots)
  - [installation](#installation)
    - [updating](#updating)
  - [todo](#todo)
  - [discord](#discord)

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
    <td><img src="https://i.imgur.com/DFio2vy.png" title="2FA setup" alt="2FA setup"></td>
  </tr>
</table>

## installation

> If you need help, join the [discord server](https://discord.gg/VDMX6VQRZm). This guide assumes you are on linux with a basic understanding of linux and docker.

> To migrate from micro 0.0.x to 1.0.0, see [MIGRATING.md](MIGRATING.md).

1. Install `git`, `docker` and `docker-compose`
2. Download the files in this repository, `git clone https://github.com/sylv/micro.git`
3. Copy the example configs to the current directory, `cp ./micro/example/* ./`
4. Fill out `.microrc.yaml`, `Caddyfile` and `docker-compose.yml`. **It is extremely important you read through each of the 3 files and make sure you understand what they do.** Specifically, `.microrc.yaml` contains a secret that handles authentication, if it is not a secure random string everyone can sign in as anyone they want without a password.
5. Run `docker-compose up -d` to start the database and micro.
6. Get the startup invite by doing `docker-compose logs micro` and copying the invite URL that should be somewhere towards the end of the log. Go to that URL to create the first account.

Setup is now complete and your instance should be working.

### updating

You should take a full database backup before updating. Pending database migrations will be applied automatically on startup.

1. `docker-compose pull micro`
2. `docker-compose up -d micro`

## todo

- [ ] Ratelimiting
- [ ] Admin UI
- [ ] Deletion URLs for pastes/links
- [ ] Password recovery via emails
- [ ] SQLite support
- [ ] Private email aliases like firefox relay (might be difficult/expensive)

## discord

<a href="https://discord.gg/VDMX6VQRZm" target="__blank">
  <img src="https://discordapp.com/api/guilds/778444719553511425/widget.png?style=banner2" alt="sylo.digital"/>
</a>
