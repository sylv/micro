import { Entity, type IdentifiedReference, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import mime from 'mime-types';
import { config } from '../../config.js';
import { generateContentId } from '../../helpers/generate-content-id.helper.js';
import { Resource } from '../../helpers/resource.entity-base.js';
import { Paginated } from '../../types/paginated.type.js';
import { User } from '../user/user.entity.js';

@Entity({ tableName: 'pastes' })
@ObjectType({ isAbstract: true })
export class Paste extends Resource {
  @PrimaryKey()
  @Field(() => ID)
  id: string = generateContentId();

  @Property({ type: 'varchar', length: 128, nullable: true })
  @Field({ nullable: true })
  title?: string;

  @Property({ type: 'varchar', length: 500000, lazy: true })
  @Field()
  content: string;

  @Property({ nullable: true })
  @Field({ nullable: true })
  extension?: string;

  @Property()
  @Field()
  encrypted: boolean;

  @Property()
  @Field()
  burn: boolean;

  @Property({ nullable: true, type: Date })
  @Field({ nullable: true })
  expiresAt?: Date;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @Exclude()
  @ManyToOne(() => User, {
    hidden: true,
    nullable: true,
    wrappedReference: true,
  })
  owner?: IdentifiedReference<User>;

  @Field({ nullable: true })
  @Property({ persist: false })
  burnt?: boolean;

  getPaths() {
    const viewUrl = `/p/${this.id}`;
    const directUrl = `/p/${this.id}${this.extension}`;
    const metadataUrl = `/api/paste/${this.id}`;
    return {
      view: viewUrl,
      direct: directUrl,
      metadata: metadataUrl,
    };
  }

  getType() {
    return (this.extension && mime.lookup(this.extension)) || 'text/plain';
  }

  [OptionalProps]: 'createdAt' | 'expiresAt';
}

@InputType()
export class CreatePasteDto {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  @Field({ nullable: true })
  title?: string;

  @IsString()
  @Length(1, config.maxPasteLength)
  @Field()
  content: string;

  @IsBoolean()
  @Field()
  encrypted: boolean;

  @IsString()
  @Length(1, 10)
  @IsOptional()
  @Field({ nullable: true })
  extension?: string;

  @IsBoolean()
  @IsOptional()
  @Field()
  burn: boolean;

  @IsBoolean()
  @IsOptional()
  @Field()
  paranoid: boolean;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  hostname?: string;

  @IsNumber()
  @IsOptional()
  @Field({ nullable: true })
  expiresAt?: number;
}

@ObjectType()
export class PastePage extends Paginated(Paste) {}
