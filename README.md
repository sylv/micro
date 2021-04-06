# micro

an invite-only file sharing service with support for ShareX.

<table>
  <tr>
    <td><img src="https://i.imgur.com/DDVsnci.png" title="Preview" alt="Preview"></td>
    <td><img src="https://i.imgur.com/21rYxiu.png" title="Preview" alt="Preview"></td>
   </tr> 
  </tr>
  <tr>
    <td><img src="https://i.imgur.com/WJ72q4q.png" title="Preview" alt="Preview"></td>
    <td><img src="https://i.imgur.com/8gjY8FK.png" title="Preview" alt="Preview"></td>
   </tr> 
  </tr>
</table>

## installation

Before you get started, please keep in mind micro isn't really intended to be self-hosted; setting it up can be tricky and managing it isn't particularly fun. This is a *very* rough guide to help people that already know what they're doing. If you can't follow along, you should hold off on hosting your own instance until there are better instructions. I'd also recommend you read through the files in [/example](/example) first to see if you can follow along, because if you can't you're just gonna waste time trying to follow the instructions below.

1. Install `git`, `docker` and `docker-compose`
2. Download the files in this repository, `git clone https://github.com/sylv/micro.git`
3. Copy the example configs to the current directory, `cp ./micro/example/* ./`
4. Fill out `.microrc`, `Caddyfile` and `docker-compose.yml`. **You need to read through each file carefully or you'll risk fucking up your entire micro instance.** The comments are important and include information on initial startup and security. Caddy is optional but it will handle encrypting traffic and redirecting insecure requests, so for anything but a test environment you should use it or something similar.
5. Run `docker-compose run micro prisma db push --preview-feature` to create database tables.
6. Run `docker-compose up micro -d` to start micro.
7. Get the startup invite by doing `docker-compose logs micro` and copying the invite URL that should be somewhere towards the end of the log. Go to that URL to create the first account.

## usage

Basically just sign in and download a ShareX config. The embedded config will embed files on the micro site with fancy UI and extra information like file size, creation date, etc. Direct links go directly to the file and skip the UI entirely. What you pick is really up to personal preference, but you should try out both before settling on one or the other.

You can create invites for other users by going to `/api/invite` and copying the URL it gives you. Each invite is valid for an hour and cannot be revoked. **Passwords are set in stone and cannot be changed.** This will change in the future to allow you to manually reset users passwords. There isn't any other hidden admin UI as of yet.

 
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
- [X] EXIF metadata removal
- [ ] Video thumbnails
- [ ] Markdown previews
- [ ] Pastes

## todo

- [ ] Ratelimiting
- [ ] Image width+height should be stored so the image preview doesn't flash while loading.
- [ ] FileEmbed.tsx has trouble scaling down on mobile. May be due to the file name not truncating properly, also an issue with text previews that are long and wide.
- [ ] Domain dropdown should be a multi-select like the pre-tailwind design.