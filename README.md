<p align="center">
   <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-primary">
      <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path>
      <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path>
   </svg>
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=next,tailwind,nest,typescript,docker,graphql" />
  <br/>
  <a href="https://discord.gg/VDMX6VQRZm"><kbd>🔵 discord</kbd></a> <a href="https://micro.sylo.digital"><kbd>🟢 hosted instance</kbd></a>
</p>

# micro

A vanity file sharing service with support for ShareX. You can see a preview at https://micro.sylo.digital

- [micro](#micro)
  - [features](#features)
  - [screenshots](#screenshots)
  - [installation](#installation)
    - [configuration](#configuration)
    - [updating](#updating)
  - [development](#development)
    - [`web` package notes](#web-package-notes)
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

> [!NOTE]
> If you need help, join the [discord server](https://discord.gg/VDMX6VQRZm). This guide assumes you are on linux with a basic understanding of linux and docker.

> [!TIP]
> If you are already familiar with docker, you can look at the [compose file](./example/compose.yml) and [config file](./example/.microrc.yaml) to get setup quickly. The below is a more detailed guide for inexperienced users.

1. Install `git` and `docker`
2. Download the files in this repository, `git clone https://github.com/sylv/micro.git`
3. Copy the example configs to the current directory, `cp ./micro/example/* ./`
4. Fill out `.microrc.yaml`, `Caddyfile` and `docker compose.yml`. **It is extremely important you read through each of the 3 files and make sure you understand what they do.** Specifically, `.microrc.yaml` contains a secret that handles authentication, if it is not a secure random string everyone can sign in as anyone they want without a password.
5. Run `docker compose up -d` to start the database and micro.
6. Get the startup invite by doing `docker compose logs micro` and copying the invite URL that should be somewhere towards the end of the log. Go to that URL to create the first account.

Setup is now complete and your instance should be working.
To add another user, sign in then go to `/api/invite` and copy the URL it gives you. This will be improved in the future.

### configuration

micro uses [venera](https://github.com/sylv/venera) to load configuration files. Configuration files are validated on startup, and may log errors if invalid setups are detected. The venera page has more information, but tl;dr:

- `.microrc.yaml` is the main configuration file.
- You can override any config value with an environment variable. The key `hosts.0.url` would be set as `MICRO_HOSTS__0__URL`
- You can use other file formats, like JSON or TOML.

### updating

You should take a full database backup before updating, but you won't, will you?
The database will be automatically migrated on startup.

1. `docker compose pull micro`
2. `docker compose up -d micro`

## development

You can pull the repo and then `pnpm install`, after that everything should be good to go. You can start the `packages/api`/`packages/web` with `pnpm watch`.

### `web` package notes

> [!IMPORTANT]
> tl;dr, `web` is quirky and some packages that depend on react may break. if they do, try adding them to `noExternal` in vite.config.ts and they'll probably work.

The web package is a little weird. It uses [vike](https://vike.dev) in place of what might normally be nextjs, [preact](https://preactjs.com) in place of react and [vite](https://vitejs.dev) to build it all. Unlike nextjs, we have much more control over rendering, SSR, routing, etc. It's much faster, and much more fun. Of course, nothing is free - some hacky workarounds are required to get it working.

Preact is smaller, faster[,](https://tenor.com/view/26464591) and more fun than react. It's a drop-in replacement, but actually dropping it in is the hard part. The main problem is that in SSR mode, vite does not bundle dependencies, which means aliasing `react` to `preact` does not work because it's not transforming the packages to replace the react imports. You can force it to bundle dependencies, but then it chokes on some node dependencies like fastify. The only way I've found to get around this is to:

- Alias `react` to `preact` in node_modules using `.pnpmfile.cjs`
- Add some packages that still complain to `noExternal` in `vite.config.ts`, which forces them to be bundled and appears to resolve any remaining issues.

`tsup` is used as a final build step to bundle everything together. Vite breaks doing this, but not doing it results in much larger docker images.

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
