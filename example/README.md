# example

This directory contains an example deployment for micro.
It uses [docker](https://docker.com) and [cloudflare tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/) to deploy it anywhere.

## usage

> [!NOTE]
> If you need help, join the [discord server](https://discord.gg/VDMX6VQRZm). This guide assumes you are on linux with a basic understanding of linux and docker.

> [!IMPORTANT]
> This guide assumes you have installed docker and cloudflare tunnel. It also assumes you have basic knowledge of them. 
> If you are stuck or discover problems with this guide, ask in the [discord server](https://discord.gg/VDMX6VQRZm) or look at other guides for discord/cloudflare tunnel.

1. Clone the example to a local directory
2. Fill out `micro.yaml`, each option is documented in the file. Most importantly, make sure `secret` is changed.
3. Replace the postgresql password in `compose.yaml` with a secure password.
4. Setup the tunnel
   1. `docker compose exec tunnel cloudflared tunnel login`
   2. `docker compose exec tunnel cloudflared tunnel create micro`
   3. You will get a tunnel ID that looks like `168b9890-caa1-44c1-822b-12cf1a5e361e`, copy it and replace `YOUR_TUNNEL_ID` in `tunnel.yaml` with it.
   4. Replace the `example.net` domain with your own domain in `tunnel.yaml`. 
5. Start micro with `docker compose up -d`
6. Run `docker compose logs micro`, the initial startup will log an invite link. Go to it and setup the first account, which is given admin permissions automatically.

> [!TIP]
> Consider swapping cloudflare tunnel for something else. It's used in this example for convenience as it works behind NATs and firewalls and provides automatic SSL. You might prefer using Caddy, nginx, traefik, or something else in its place.

### configuration

All the configuration options are listed in [the example config](./micro.yaml) file. [venera](https://github.com/sylv/venera) is used to load configs, which are validated at startup and may log errors if an invalid configuration is detected. The venera page has detailed information, but tl;dr:

- `.microrc.yaml` is the main configuration file.
- You can override any config value with an environment variable. The key `hosts.0.url` would be set as `MICRO_HOSTS__0__URL`
- You can use other file formats, like JSON or TOML.

### updating micro

You should take a full database backup before updating, but you won't, will you?
The database will be automatically migrated on startup, all you have to do is run a newer version of micro.

1. `docker compose pull micro`
2. `docker compose up -d micro`

### updating postgresql

Updating postgres is an involved process. Google will have better information. In general, you will want to do something like this:

- Export your database to a `.sql` file, using something like `docker compose exec postgres pg_dump -U postgres -d micro > backup.sql`
- Stop your database
- Rename the database directory to something else, like `mv ./data ./data-old`
- Update `compose.yaml` to point to the new postgres version, for example `postgres:16-alpine` is for v16 of postgres.
- Start the database `docker compose up -d postgres`
- Restore the database using the `.sql` file
- Once it all checks out, you can delete the old database directory if you are confident you won't need it.