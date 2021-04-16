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
5. Run `docker-compose up -d postgres` to start the database.
6. Run `docker-compose run -e DATABASE_URL=postgresql://micro:youshallnotpass@postgres/micro micro prisma db push --preview-feature` to create database tables.
7. Run `docker-compose up micro -d` to start micro.
8. Get the startup invite by doing `docker-compose logs micro` and copying the invite URL that should be somewhere towards the end of the log. Go to that URL to create the first account.

## administration

There currently isn't an admin interface, only endpoints that let you do some basic tasks.

- To create an invite, go to `/api/invite` and copy the link. Invites are valid for an hour and cannot be revoked once generated.
- To add a tag to a user, go to `/api/user/:id/tags/add/:tag`, where `:id` is the **id** of the user you want to add the tag to, and `:tag` is the name of the tag to add.
- To remove a tag, go to `/api/user/:id/tags/remove/:tag`. See above for parameters.
- To delete a user, go to `/api/user/:id/delete`. **This will only delete the user, files they have uploaded will not be removed from disk.** 

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
- [ ] Dashboard pagination for files.
- [ ] Cleanup that deletes files larger then X bytes after Y days (of no views?)
- [ ] Toasts overflow on mobile