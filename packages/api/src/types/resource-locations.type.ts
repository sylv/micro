import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResourceLocations {
  @Field(() => String)
  view: string;

  @Field(() => String)
  direct: string;

  @Field(() => String, { nullable: true })
  delete?: string;

  @Field(() => String, { nullable: true })
  thumbnail?: string;
}
