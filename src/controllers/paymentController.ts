import { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { IPaymentCreate } from '@/contracts/dto/payment.dto'
import { ICombinedRequest } from '@/contracts/dto/request'
import { IUserRequest } from '@/contracts/dto/user.dto'
import { paymentService } from '@/services/paymentService'

export const paymentController = {
  paymentCreate: async (
    {
      context: { user },
      body: { amount }
    }: ICombinedRequest<IUserRequest, IPaymentCreate>,
    res: Response
  ) => {
    await paymentService.createPaymentFlow({
      user,
      amount
    })
    return res.status(StatusCodes.OK).json({
      message: ReasonPhrases.OK,
      status: StatusCodes.OK
    })
  }
}
