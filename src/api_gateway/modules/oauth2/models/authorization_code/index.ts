import { AuthorizationCodeInterface as Interface } from './interface'
import { Schema } from './schema'
import mongoose = require('mongoose')

export const AuthorizationCode: mongoose.Model<Interface> = mongoose.model<Interface>('AuthorizationCode', Schema)

export interface AuthorizationCodeType extends mongoose.Model<Interface> {}
