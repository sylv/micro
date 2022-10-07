/* eslint-disable unicorn/no-keyword-prefix */
import type { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Edge } from './edge.type.js';

export interface Paginated<T> {
  totalCount: number;
  edges: Edge<T>[];
  pageInfo: PageInfo;
}

@ObjectType()
export class PageInfo {
  @Field(() => String, { nullable: true })
  startCursor?: string;

  @Field(() => String, { nullable: true })
  endCursor?: string;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;
}

export function Paginated<T>(classRef: Type<T>): Type<Paginated<T>> {
  @ObjectType(`${classRef.name}PageEdge`)
  abstract class EdgeType extends Edge(classRef) {}

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements Paginated<T> {
    @Field(() => Int)
    totalCount: number;

    @Field(() => [EdgeType])
    edges: EdgeType[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
  }

  return PaginatedType as Type<Paginated<T>>;
}
