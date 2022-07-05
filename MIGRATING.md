# migrating

## from micro 0.0.x to micro 1.0.0

I've made a best effort attempt to make migration as painless as possible, mostly for my own sanity. These steps are quite in-depth but in reality the migration should be fairly simple for most users. If you get stuck at any point, please join the [discord server](https://discord.gg/VDMX6VQRZm) and ask for help.

1. Create a backup of the database and the data directory.
2. Update your `.microrc` with the changes seen in [example config](example/.microrc.yaml) (your config may be in json with the example now being yaml, but the keys are 1:1), notable changes are `database` is now `databaseUrl`.
3. Change the docker image from `sylver/micro` or `sylver/micro:master` to `sylver/micro:main`
4. Change the port from `8080` to `3000`. If you are using the example config, do this in `Caddyfile` by changing `micro:8080` to `micro:3000`.
5. Start the container. It should exit on startup with an error message saying that there is data that must be migrated. If it does not, you did not update the image tag correctly or it cannot detect data to be migrated.
6. Read the error message, then stop the container and set the `MIGRATE_OLD_DATABASE` environment variable to `true`
7. Start the container and it will migrate the database automatically.

After that, you should be able to use it as normal. Thumbnails are the only data that is not migrated, as the format changed and it doesn't really matter because they can just be regenerated on demand. If you run into any issues during migration, join the [discord server](https://discord.gg/VDMX6VQRZm) or open an issue on [github](https://github.com/sylv/micro/issues/new).
