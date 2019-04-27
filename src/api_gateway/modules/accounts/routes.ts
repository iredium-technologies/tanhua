import { RouteDrawer } from '@iredium/butterfly/lib/routes'
import { handle } from '@iredium/butterfly/lib/routes/handle'
import * as c from './controllers'

export function accountsRoutes (route: RouteDrawer): void {
  route.get('/me', handle(c.UsersController, 'me'))
  route.post('/oauth/token', handle(c.OauthController, 'token'))
  route.post('/users/authenticate', handle(c.UsersController, 'authenticate'))
  route.get('/users/login', handle(c.UsersController, 'loginView'))
  route.get('/users/register', handle(c.UsersController, 'registerView'))
  route.post('/users/login', handle(c.UsersController, 'login'))
  route.post('/users/register', handle(c.UsersController, 'register'))
  route.resources('/users', c.UsersController)
}
