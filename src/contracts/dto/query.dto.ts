/**
 * @typedef {Object} QueryResult
 * @property {Document[]} results - Results found
 * @property {number} page - Current page
 * @property {number} limit - Maximum number of results per page
 * @property {number} totalPages - Total number of pages
 * @property {number} totalResults - Total number of documents
 */
export interface QueryResult<T> {
  results: T[]
  page: number
  limit: number
  totalPages: number
  totalResults: number
}

/**
 * Query options interface
 */
export interface QueryOptions {
  sortBy?: string
  populate?: string
  limit?: number
  page?: number
}
