import { RouteDrawer } from '@iredium/butterfly/lib/routes'
import { handle } from '@iredium/butterfly/lib/routes/handle'
import * as c from './controllers'

export function oauthRoutes (route: RouteDrawer): void {
  route.resources('/applications', c.ApplicationsController)
  route.resources('/credentials', c.CredentialsController)
  route.post('/oauth/token', handle(c.CredentialsController, 'issueCredential'))
}
