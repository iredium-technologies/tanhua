import { VerifyAccessToken } from '~/src/api_gateway/modules/oauth2/middlewares/verify_access_token'
import { oauthRoutes } from './routes'

export default function oauth2 ({ hook }): void {
  hook('tanhua:registerApiMiddlewares', function ({ middlewares }): void {
    middlewares.push(new VerifyAccessToken())
  })

  hook('butterfly:drawRoutes', oauthRoutes)
}
