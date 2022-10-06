import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OTPEnabledDto {
  @Field(() => [String])
  recoveryCodes: string[];

  @Field()
  secret: string;

  @Field()
  qrauthUrl: string;
}
