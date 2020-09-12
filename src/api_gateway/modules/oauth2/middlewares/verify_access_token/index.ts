import { DatabaseAccessTokenVerifier } from '~/src/api_gateway/modules/oauth2/middlewares/verify_access_token/verifier/database_access_token_verifier'
import { BaseMiddleware } from '@iredium/butterfly/lib/middlewares'
import { RequestHandler } from 'express'
import { UserService } from '../../../accounts/services/user'

export class VerifyAccessToken extends BaseMiddleware {
  public generate (): RequestHandler {
    return async function verifyAccessToken (req, res, next): Promise<void> {
      const isOptionRequest = !!req.get('access-control-request-method')
      if (!isOptionRequest) {
        const authorizationHeader: string = req.get('authorization')
        console.log({ authorizationHeader })
        const verifier = new DatabaseAccessTokenVerifier(authorizationHeader)
        const credential = await verifier.verifyToken()
        const service = new UserService()
        req['clientId'] = credential.client_id
        if (credential.user_id) {
          const user = await service.get(credential.user_id)
          req['locals']['user'] = user
          req['authenticatedUserId'] = credential.user_id
        }
      }
      next()
    }
  }
}
