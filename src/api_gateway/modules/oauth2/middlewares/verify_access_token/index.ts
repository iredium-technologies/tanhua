import { AccessTokenVerifier } from '~/src/api_gateway/modules/oauth2/middlewares/verify_access_token/access_token_verifier'

export async function verifyAccessToken (req, res, next): Promise<void> {
  try {
    const verifier = new AccessTokenVerifier(req.headers['authorization'])
    await verifier.verifyToken()
    next()
  } catch (e) {
    next(e)
  }
}
