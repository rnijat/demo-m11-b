import { IAllProductRequest } from '@/contracts/dto/product.dto'
import { IQueryRequest } from '@/contracts/dto/request'
import { productService } from '@/services/productService'
import { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export const productController = {
  getAllProducts: async (
    { query: { page, limit } }: IQueryRequest<IAllProductRequest>,
    res: Response
  ) => {
    const products = await productService.getAll({ page, limit })
    return res.status(StatusCodes.OK).json({
      data: products,
      message: ReasonPhrases.OK,
      status: StatusCodes.OK
    })
  }
}
