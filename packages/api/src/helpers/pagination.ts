import { BadRequestException } from '@nestjs/common';
import type { Edge } from '../types/edge.type';
import type { Paginated } from '../types/paginated.type';

export function createCursor(offset: number) {
  return Buffer.from(`${offset}`, 'utf8').toString('base64');
}

export function parseCursor(cursor: string) {
  const decoded = Buffer.from(cursor, 'base64').toString('utf8');
  const offset = Number(decoded);
  if (Number.isNaN(offset)) {
    throw new BadRequestException(`Invalid cursor "${cursor}"`);
  }

  return offset;
}

export function paginate<T>(items: T[], total: number, offset: number): Paginated<T> {
  const edges: Edge<T>[] = [];
  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const item = items[itemIndex];
    const cursor = createCursor(offset + itemIndex);
    edges.push({
      cursor: cursor,
      node: item,
    });
  }

  return {
    edges: edges,
    totalCount: total,
    pageInfo: {
      endCursor: edges[0] ? edges[edges.length - 1].cursor : undefined,
      startCursor: edges[0] ? edges[0].cursor : undefined,
      hasPreviousPage: offset > 0,
      hasNextPage: offset + items.length < total,
    },
  };
}
