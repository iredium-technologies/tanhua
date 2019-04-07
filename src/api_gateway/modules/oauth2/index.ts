import { verifyAccessToken } from '~/src/api_gateway/modules/oauth2/middlewares/verify_access_token'
import { oauthRoutes } from './routes'

export default function oauth2 ({ hook }): void {
  hook('tanhua:registerApiMiddlewares', function ({ middlewares, api }): void {
    middlewares.push(verifyAccessToken)
  })

  hook('butterfly:drawRoutes', oauthRoutes)
}
