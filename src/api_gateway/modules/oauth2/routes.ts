import { RouteDrawer } from '@iredium/butterfly/lib/routes'
import * as c from './controllers'

export function oauthRoutes (route: RouteDrawer): void {
  route.resources('/applications', c.ApplicationsController)
  route.resources('/credentials', c.CredentialsController)
}
