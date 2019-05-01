import { RouteDrawer, handle } from '@iredium/butterfly/lib/routes'
import * as c from './controllers'

export function oauthRoutes (route: RouteDrawer): void {
  route.get('/oauth/applications', handle(c.ApplicationsController, 'dashboard'))
  route.get('/oauth/applications/create', handle(c.ApplicationsController, 'createForm'))
  route.post('/oauth/applications', handle(c.ApplicationsController, 'createAction'))
  route.get('/oauth/applications/:application/edit', handle(c.ApplicationsController, 'editForm'))
  route.patch('/oauth/applications/:application', handle(c.ApplicationsController, 'editAction'))
  route.get('/oauth/authorize', handle(c.OauthController, 'authorize'))
  route.resources('/applications', c.ApplicationsController)
  route.resources('/credentials', c.CredentialsController)
}
