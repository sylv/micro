import { Entity, IdentifiedReference, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { IsBoolean, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import mime from 'mime-types';
import { config } from '../../config';
import { generateContentId } from '../../helpers/generate-content-id.helper';
import { ResourceBase } from '../../resource.entity-base';
import { User } from '../user/user.entity';

@Entity({ tableName: 'pastes' })
export class Paste extends ResourceBase {
  @PrimaryKey()
  id: string = generateContentId();

  @Property({ type: 'varchar', length: 128, nullable: true })
  title?: string;

  @Property({ type: 'varchar', length: 500000 })
  content: string;

  @Property({ nullable: true })
  extension?: string;

  @Property()
  encrypted: boolean;

  @Property()
  burn: boolean;

  @Property({ nullable: true, type: Date })
  expiresAt?: Date;

  @Property({ type: Date })
  createdAt = new Date();

  @ManyToOne(() => User, {
    hidden: true,
    nullable: true,
    wrappedReference: true,
  })
  owner?: IdentifiedReference<User>;

  @Property({ persist: false })
  get paths() {
    const viewUrl = `/p/${this.id}`;
    const directUrl = `/p/${this.id}${this.extension}`;
    const metadataUrl = `/api/paste/${this.id}`;
    return {
      view: viewUrl,
      direct: directUrl,
      metadata: metadataUrl,
    };
  }

  @Property({ persist: false })
  get type() {
    return (this.extension && mime.lookup(this.extension)) || 'text/plain';
  }

  [OptionalProps]: 'owner' | 'createdAt' | 'expiresAt' | 'extension' | 'urls' | 'paths' | 'type';
}

export class CreatePasteDto {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  title?: string;

  @IsString()
  @Length(1, config.maxPasteLength)
  content: string;

  @IsBoolean()
  encrypted: boolean;

  @IsString()
  @Length(1, 10)
  @IsOptional()
  extension?: string;

  @IsBoolean()
  @IsOptional()
  burn: boolean;

  @IsBoolean()
  @IsOptional()
  paranoid: boolean;

  @IsNumber()
  @IsOptional()
  expiresAt?: number;
}
