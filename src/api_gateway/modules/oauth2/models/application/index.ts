import { ApplicationInterface as Interface } from './interface'
import { Schema } from './schema'
import mongoose = require('mongoose')

export const Application: mongoose.Model<Interface> = mongoose.model<Interface>('Application', Schema)

export interface ApplicationType extends mongoose.Model<Interface> {}
