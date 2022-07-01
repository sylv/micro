import type { EventArgs, EventSubscriber } from '@mikro-orm/core';
import { Subscriber } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { File } from './file.entity';

@Injectable()
@Subscriber()
export class FileSubscriber implements EventSubscriber<File> {
  private readonly log = new Logger(FileSubscriber.name);
  constructor(private readonly storageService: StorageService) {}

  getSubscribedEntities() {
    return [File];
  }

  async beforeDelete({ entity, em }: EventArgs<File>) {
    const filesWithHash = await em.count(File, { hash: entity.hash });
    if (filesWithHash === 0) {
      this.log.debug(`Deleting file on disk with hash ${entity.hash} (${entity.id})`);
      await this.storageService.delete(entity.hash);
    }
  }
}
