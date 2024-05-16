import type { EventArgs, EventSubscriber } from "@mikro-orm/core";
import { Injectable, Logger } from "@nestjs/common";
import { StorageService } from "../storage/storage.service.js";
import { FileEntity } from "./file.entity.js";

@Injectable()
export class FileSubscriber implements EventSubscriber<FileEntity> {
  private readonly log = new Logger(FileSubscriber.name);
  constructor(private storageService: StorageService) {}

  getSubscribedEntities() {
    return [FileEntity];
  }

  async beforeDelete({ entity, em }: EventArgs<FileEntity>) {
    const filesWithHash = await em.count(FileEntity, { hash: entity.hash });
    if (filesWithHash === 0) {
      this.log.debug(`Deleting file on disk with hash ${entity.hash} (${entity.id})`);
      await this.storageService.delete(entity);
    }
  }
}
