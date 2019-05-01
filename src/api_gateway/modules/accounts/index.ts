import { CurrentUser } from './middlewares/current_user'
import { accountsRoutes } from './routes'
import path = require('path')

export default function accounts ({ hook }): void {
  hook('butterfly:registerViewPaths', (paths: string[]): void => {
    paths.push(path.join(__dirname, '/views'))
  })

  hook('butterfly:registerMiddlewares', (middlewares): void => {
    middlewares.push(new CurrentUser())
  })

  hook('butterfly:drawRoutes', accountsRoutes)
}
