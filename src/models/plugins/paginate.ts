/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryOptions, QueryResult } from '@/contracts/dto/query.dto'
import { IProduct } from '@/contracts/model/product'
import { Schema } from 'mongoose'

/**
 * Pagination function
 * @param {Schema} schema - Mongoose schema
 */
export const paginate = <T extends IProduct>(schema: Schema<T>): void => {
  schema.statics.paginate = async function (
    filter: Record<string, any> = {},
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    let sort = ''

    if (options.sortBy) {
      const sortingCriteria: string[] = []
      options.sortBy.split(',').forEach((sortOption: string) => {
        const [key, order] = sortOption.split(':')
        sortingCriteria.push((order === 'desc' ? '-' : '') + key)
      })
      sort = sortingCriteria.join(' ')
    } else {
      sort = 'createdAt'
    }

    const limit =
      options.limit && parseInt(options.limit.toString(), 10) > 0
        ? parseInt(options.limit.toString(), 10)
        : 10

    const page =
      options.page && parseInt(options.page.toString(), 10) > 0
        ? parseInt(options.page.toString(), 10)
        : 1

    const skip = (page - 1) * limit

    const countPromise = this.countDocuments(filter).exec()
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit)

    if (options.populate) {
      options.populate.split(',').forEach((populateOption: string) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .reduce((a, b) => ({ path: b, populate: a }))
        )
      })
    }

    docsPromise = docsPromise.exec()

    const [totalResults, results] = await Promise.all([
      countPromise,
      docsPromise
    ])
    const totalPages = Math.ceil(totalResults / limit)

    return {
      results,
      page,
      limit,
      totalPages,
      totalResults
    }
  }
}
