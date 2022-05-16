import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Paste } from "./paste.entity";

@Injectable()
export class PasteService {
  private log = new Logger("PasteService");
  constructor(@InjectRepository(Paste) private pasteRepo: EntityRepository<Paste>) {}

  async getPaste(pasteId: string) {
    const paste = await this.pasteRepo.findOneOrFail(pasteId);
    if (paste.expiresAt && paste.expiresAt < Date.now()) {
      await this.pasteRepo.removeAndFlush(paste);
      throw new NotFoundException();
    }

    return paste;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async deleteExpiredPastes() {
    const deleted = await this.pasteRepo.nativeDelete({
      expiresAt: {
        $lte: Date.now(),
      },
    });

    if (deleted !== 0) {
      this.log.debug(`Deleted ${deleted} expired pastes`);
    }
  }
}
