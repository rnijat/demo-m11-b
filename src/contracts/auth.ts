import { IUser } from './model/user'

export type SignInPayload = Pick<IUser, 'gsmNumber' | 'password'>

export type RefreshTokenPayload = Pick<IUser, 'gsmNumber'>
