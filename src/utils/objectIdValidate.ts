import { ObjectId } from 'bson'
import mongoose from 'mongoose'

export const objectId = (value: ObjectId, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message(
      `"${helpers.state.path}" must be a valid MongoDB ObjectId`
    )
  }
  return value
}
