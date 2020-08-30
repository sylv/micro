# micro

A not-so-micro [ShareX](https://getsharex.com/) server with support for thumbnails, deleting uploads and basic users. Originally intended for use on a Raspberry Pi, there are docker images built for most platforms. See the [image tags](https://hub.docker.com/r/sylver/micro/tags) for a list of supported platforms.

# setup

micro is intended on being used exclusively with [Docker](https://docs.docker.com/get-docker/).

1. Copy `.microrc.example` from this repository to `.microrc` on your system and fill it out.
   - For initial startup set `"synchronize": true`. After micro has populated the database you should set `"synchronize": false` or else data may be overwritten during updates.
   - Environment variables can also be used. `MICRO_USERS__admin=youshallnotpass` would define a user called "admin" with a key "youshallnotpass".
2. `docker run -d --name micro -v /path/to/your/.microrc:/opt/micro/.microrc sylver/micro:master`
   - Replace `/path/to/your/.microrc` with the actual path to the `.microrc` file you filled out.
3. Visit `/getcfg?key=YOUR_KEY_FROM_MIRORC` to download a ShareX config for your server.
