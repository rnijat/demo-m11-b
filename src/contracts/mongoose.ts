import { Model } from 'mongoose'

export interface PaginateOptions {
  select?: Record<string, unknown> | string
  sort?: Record<string, unknown> | string
  populate?: Record<string, unknown> | string
  lean?: boolean
  leanWithId?: boolean
  offset?: number
  page?: number
  limit?: number
  pagination?: boolean
  customLabels?: Record<string, unknown>
}

export interface PaginateResult<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page?: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage?: number | null
  nextPage?: number | null
}

export interface PaginateModel<T> extends Model<T> {
  toJSON(): Record<string, unknown>
  paginate(
    query?: Record<string, unknown>,
    options?: PaginateOptions
  ): Promise<PaginateResult<T>>
}

export const mongoosePaginateLabel = {
  totalDocs: 'itemCount',
  docs: 'items',
  limit: 'limit',
  page: 'currentPage',
  nextPage: 'nextPage',
  prevPage: 'prevPage',
  totalPages: 'pageCount',
  hasPrevPage: 'hasPrev',
  hasNextPage: 'hasNext',
  pagingCounter: 'pageCounter',
  meta: 'paginator'
}
