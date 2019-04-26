import { RouteDrawer, handle } from '@iredium/butterfly/lib/routes'
import * as c from './controllers'

export function oauthRoutes (route: RouteDrawer): void {
  route.get('/oauth/applications', handle(c.OauthController, 'applications'))
  route.resources('/applications', c.ApplicationsController)
  route.resources('/credentials', c.CredentialsController)
}
