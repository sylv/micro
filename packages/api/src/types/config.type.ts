import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConfigHost {
  @Field()
  url: string;

  @Field()
  normalised: string;

  @Field({ nullable: true })
  redirect?: string;
}

@ObjectType()
export class Config {
  @Field()
  inquiriesEmail: string;

  @Field()
  uploadLimit: number;

  @Field(() => [String])
  allowTypes: string[];

  @Field()
  requireEmails: boolean;

  @Field(() => [ConfigHost], {
    description: 'A list of hosts the user can access.',
  })
  hosts: ConfigHost[];

  @Field(() => ConfigHost)
  rootHost: ConfigHost;

  @Field(() => ConfigHost, {
    description:
      'The host the request is being made to. This host may not be in the hosts list if the user is not authorized to access it.',
  })
  currentHost: ConfigHost;
}
