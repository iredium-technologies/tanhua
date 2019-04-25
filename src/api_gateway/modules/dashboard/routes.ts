import { RouteDrawer } from '@iredium/butterfly/lib/routes'
import { handle } from '@iredium/butterfly/lib/routes/handle'
import * as c from './controllers'

export function dashboardRoutes (routes: RouteDrawer): void {
  routes.get('/oauth/applications', handle(c.ApplicationsController, 'index'))
}
