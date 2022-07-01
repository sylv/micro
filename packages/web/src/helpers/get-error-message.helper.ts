import { ApolloError } from '@apollo/client';
import { HTTPError } from './http.helper';
import { isObject } from './is-object.helper';

export function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === 'string') return error;
  if (error instanceof ApolloError) {
    return error.message;
  }

  if (error instanceof HTTPError) {
    return error.text;
  }

  if (isObject(error) && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
}
