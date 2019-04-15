import { RouteDrawer } from '@iredium/butterfly/lib/routes'
import { handle } from '@iredium/butterfly/lib/routes/handle'
import * as c from './controllers'
import vhost = require('vhost')

export function dashboardRoutes (routes: RouteDrawer): void {
  routes.get('/oauth/applications', vhost(process.env.ACCOUNTS_HOST, handle(c.ApplicationsController, 'index')))
}
