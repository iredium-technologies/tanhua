import { UserInterface as Interface } from './interface'
import { Schema } from './schema'
import mongoose = require('mongoose')

export const User: mongoose.Model<Interface> = mongoose.model<Interface>('User', Schema)

export interface UserType extends mongoose.Model<Interface> {}
