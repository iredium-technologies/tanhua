import { VerifyAccessToken } from '~/src/api_gateway/modules/oauth2/middlewares/verify_access_token'
import { oauthRoutes } from './routes'
import path = require('path')

export default function oauth2 ({ hook }): void {
  hook('butterfly:registerViewPaths', (paths: string[]): void => {
    paths.push(path.join(__dirname, '/views'))
  })

  hook('tanhua:registerApiMiddlewares', function ({ middlewares }): void {
    middlewares.push(new VerifyAccessToken())
  })

  hook('butterfly:drawRoutes', oauthRoutes)
}
