import { RouteDrawer } from '@iredium/butterfly/lib/routes'
import { handle } from '@iredium/butterfly/lib/routes/handle'
import * as c from './controllers'

export function accountsRoutes (route: RouteDrawer): void {
  route.get('/me', handle(c.UsersController, 'me'))
  route.resources('/users', c.UsersController)
}
