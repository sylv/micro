# micro

A not-so-micro [ShareX](https://getsharex.com/) server with support for thumbnails, deleting uploads and basic users. Originally intended for use on a Raspberry Pi, there are docker images built for most platforms. See the [image tags](https://hub.docker.com/r/sylver/micro/tags) for a list of supported platforms.

# setup

micro is intended on being used exclusively with [Docker](https://docs.docker.com/get-docker/).

1. `cp .microrc.example .microrc`
2. Fill out .microrc with your preferred details. You can remove values you won't use.
   - For initial startup set `"synchronize": true`. After micro has populated the database you should set `"synchronize": false` or else data may be overwritten during updates.
3. `docker run -d --name micro -v /path/to/your/.microrc:/opt/micro/.microrc sylver/micro:master`
   - Replace `/path/to/your/.microrc` with the actual path to the `.microrc` file you filled out.
4. Visit `/getcfg?key=YOUR_KEY_FROM_MIRORC` to download a ShareX config for your server.
