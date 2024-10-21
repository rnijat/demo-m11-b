import { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { ICombinedRequest, IQueryRequest } from '@/contracts/dto/request'
import { IAllTransferRequest } from '@/contracts/dto/transfer.dto'
import { IUserRequest } from '@/contracts/dto/user.dto'
import { transferService } from '@/services'

export const transferController = {
  getAll: async (
    {
      context: { user },
      query: { page, limit }
    }: ICombinedRequest<IUserRequest, IQueryRequest<IAllTransferRequest>>,
    res: Response
  ) => {
    const transfers = await transferService.getAll({
      page: page as unknown as number,
      limit: limit as unknown as number,
      userId: user.id
    })

    return res.status(StatusCodes.OK).json({
      data: transfers,
      message: ReasonPhrases.OK,
      status: StatusCodes.OK
    })
  }
}
