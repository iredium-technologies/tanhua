import * as c from '~/src/controllers'

export function routes (route): void {
  route.resources('/users', c.UsersController)
}
