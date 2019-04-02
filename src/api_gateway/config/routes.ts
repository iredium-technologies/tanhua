import * as c from '~/src/api_gateway/controllers'

export function routes (route): void {
  route.resources('/users', c.UsersController)
}
