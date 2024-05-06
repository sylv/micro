import { UnauthorizedException } from '@nestjs/common';

export class AccountDisabledError extends UnauthorizedException {
  constructor(message: string) {
    super({
      // nestjs will filter out any additional keys we add to this object for graphql.
      // unfortunately, the only way for the frontend to pick this up without rewriting 
      // nestjs error handling is to append the type to the message.
      message: `ACCOUNT_DISABLED: ${message}`,
    });
  }
}
