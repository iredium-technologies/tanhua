import { verifyAccessToken } from '~/src/api_gateway/modules/oauth2/middlewares/verify_access_token'

export default function oauth2 ({ hook }): void {
  hook('tanhua:registerApiMiddlewares', function ({ middlewares, api }): void {
    middlewares.unshift(verifyAccessToken)
  })
}
