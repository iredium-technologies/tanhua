import { AccessTokenVerifier } from '~/src/api_gateway/modules/oauth2/middlewares/verify_access_token/access_token_verifier'

export function verifyAccessToken (req, res, next): void {
  const verifier = new AccessTokenVerifier(req.headers['authorization'])
  verifier.validateToken()
  next()
}
