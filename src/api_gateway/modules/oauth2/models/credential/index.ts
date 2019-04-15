import { CredentialInterface as Interface } from './interface'
import { Schema } from './schema'
import mongoose = require('mongoose')

export const Credential: mongoose.Model<Interface> = mongoose.model<Interface>('Credential', Schema)

export interface CredentialType extends mongoose.Model<Interface> {}
