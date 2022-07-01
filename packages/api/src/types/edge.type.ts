/* eslint-disable unicorn/no-keyword-prefix */
import type { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export interface Edge<T> {
  cursor: string;
  node: T;
}

export function Edge<T>(classRef: Type<T>): Type<Edge<T>> {
  @ObjectType({ isAbstract: true })
  abstract class EdgeType implements Edge<T> {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  return EdgeType as Type<Edge<T>>;
}
