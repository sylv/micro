-- fixes thumbnail cascade deletion because prisma doesnt wanna handle it for us
ALTER TABLE "thumbnails" DROP CONSTRAINT "thumbnails_fileId_fkey";
ALTER TABLE "thumbnails" ADD FOREIGN KEY ("fileId") REFERENCES files("id") ON DELETE CASCADE;