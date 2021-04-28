-- we're changing the type of thumbnails from image/jpeg to image/webp for alpha support
-- and since we dont store thumbnail mime types the choices were store them or wipe old jpeg thumbnails
-- and this seemed the better option.
TRUNCATE "thumbnails";