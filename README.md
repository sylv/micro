# micro

An invite-only file sharing service with support for ShareX. You can see a preview at https://micro.sylo.digital

- [micro](#micro)
  - [features](#features)
  - [screenshots](#screenshots)
  - [installation](#installation)
  - [migrating from 0.0.x to 1.0.0](#migrating-from-00x-to-100)
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
  </tr>
</table>

## installation

If you need help, join the [discord server](https://discord.gg/VDMX6VQRZm). This guide assumes you are on linux with a basic understanding of linux and docker.

1. Install `git`, `docker` and `docker-compose`
2. Download the files in this repository, `git clone https://github.com/sylv/micro.git`
3. Copy the example configs to the current directory, `cp ./micro/example/* ./`
4. Fill out `.microrc`, `Caddyfile` and `docker-compose.yml`. **It is extremely important you read through each of the 3 files and make sure you understand what they do.** Specifically, `.microrc` contains a secret that handles authentication, if it is not a secure random string everyone can sign in as anyone they want without a password.
5. Run `docker-compose up -d` to start the database and micro.
6. Get the startup invite by doing `docker-compose logs micro` and copying the invite URL that should be somewhere towards the end of the log. Go to that URL to create the first account.

Setup is now complete and your instance should be working. When updates come out, create a backup of the database then pull the latest image and restart the container. Unlike past versions migrations are applied automatically.

## migrating from 0.0.x to 1.0.0

I've made a best effort attempt to make migration as painless as possible, mostly for my own sanity. These steps are quite in-depth but in reality the migration should be fairly simple for most users. If you get stuck at any point, please join the [discord server](https://discord.gg/VDMX6VQRZm) and ask for help.

1. Create a backup of the database and the data directory.
2. Update your `.microrc` with the changes seen in [example config](example/.microrc), notable changes are `database` is now `databaseUrl` and `publicPastes` has been added.
3. Change the docker image from `sylver/micro` or `sylver/micro:master` to `sylver/micro:main`
4. Change the port from `8080` to `3000`. If you are using the example config, do this in `Caddyfile` by changing `micro:8080` to `micro:3000`.
5. Start the container. It should exit on startup with an error message saying that there is data that must be migrated. If it does not, you did not update the image tag correctly or it cannot detect data to be migrated.
6. Read the error message, then stop the container and set the `MIGRATE_OLD_DATABASE` environment variable to `true`
7. Start the container and it will migrate the database automatically.

After that, you should be able to use it as normal. Thumbnails are the only data that is not migrated, as the format changed and it doesn't really matter because they can just be regenerated on demand. If you run into any issues during migration, join the [discord server](https://discord.gg/VDMX6VQRZm) or open an issue on [github](https://github.com/sylv/micro/issues/new).

## todo

- [ ] Ratelimiting
- [ ] Admin UI
- [ ] Pastes should use the same embeds that files use they get all the same benefits (markdown previews, better syntax highlighting, etc)
- [ ] Run migrations on start (requires migrations to be compiled and available at runtime)
- [ ] `publicPastes=false` should hide the paste button and show an error on the paste page unless the user is signed in.
- [ ] Redirects may be broken. Also hosts with no redirect should probably just have it set to the root host, that should allow us to strip some unnecessary code.
- [ ] GIFs should probably be converted to mp4 videos to save space
  - Discord is currently blocking this as they handle embedding videos (and gifs) extremely poorly. Unless the url has "mp4" in it it outright won't embed most of the time.

## discord

<a href="https://discord.gg/VDMX6VQRZm" target="__blank">
  <img src="https://discordapp.com/api/guilds/778444719553511425/widget.png?style=banner2" alt="sylo.digital"/>
</a>
