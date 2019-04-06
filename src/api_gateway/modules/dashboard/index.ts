import { index } from './handlers/index'
import { applications } from './handlers/applications'
import vhost = require('vhost')
import express = require('express')
import path = require('path')

export default function dashboard ({ app, hook }): void {
  const router = express.Router()

  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, '/views'))

  router.get('/', index)
  router.get('/oauth/applications', applications)

  app.use(vhost(process.env.ACCOUNTS_HOST, router))
}
