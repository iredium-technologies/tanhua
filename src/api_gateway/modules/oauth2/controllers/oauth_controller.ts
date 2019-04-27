import { AuthorizationCodeInterface } from './../models/authorization_code/interface'
import { AuthorizationCodeService } from './../services/authorization_code'
import { BaseError } from '@iredium/butterfly/lib/errors'
import { OauthPolicy } from '../policies/oauth'
import { ApplicationService } from '../services/application'
import { BaseController } from '@iredium/butterfly/lib/controllers'
import { BaseResponse, ViewResponse, RedirectResponse } from '@iredium/butterfly/lib/routes'

export class OauthController extends BaseController {
  public constructor () {
    super(ApplicationService, OauthPolicy)
  }

  public async applications (req): Promise<BaseResponse> {
    this.authorize('index')

    const pagination = await this.service.paginate({
      offset: req.query.offset,
      limit: req.query.limit,
      query: Object.assign(req.query, { deleted_at: null })
    })

    return new ViewResponse('pages/applications/index.pug', {
      data: await pagination.getData(),
      meta: await pagination.getMeta()
    })
  }

  public async authorize (req): Promise<BaseResponse> {
    if (!req['session'].authenticatedUserId) {
      var fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
      return new RedirectResponse(`/users/login?from=${encodeURIComponent(fullUrl)}`)
    }

    const query = req.query || {}
    const clientId = query.client_id
    const scope = query.scope
    const redirectUri = query.redirect_uri
    const authenticatedUserId = req['session'].authenticatedUserId

    const applications = new ApplicationService()
    const application = await applications.Model.findOne({
      active: true,
      client_id: clientId
    })

    if (!application) throw new BaseError('Invalid Authorization', 'Invalid client id')

    if (!redirectUri || !application.redirect_uris.includes(redirectUri)) {
      throw new BaseError('Invalid Authorization', 'Invalid redirect uri')
    }

    if (!scope || !application.scope.includes(scope)) {
      throw new BaseError('Invalid Authorization', 'Invalid scope')
    }

    const authorizationCodes = new AuthorizationCodeService()
    const authorizationCode = await authorizationCodes.create({
      client_id: application.client_id,
      client_secret: application.client_secret,
      authenticated_user_id: authenticatedUserId,
      scope,
      redirect_uri: redirectUri
    }) as AuthorizationCodeInterface // TODO: using as seems hacky :(
    const redirectUriWithCode = this.buildRedirectUri(redirectUri, authorizationCode.code)

    return new RedirectResponse(redirectUriWithCode)
  }

  protected buildRedirectUri (redirectUri: string, authCode: string): string {
    // TODO: add better handler for this
    return `${redirectUri}${redirectUri.includes('?') ? '&' : '?'}code=${authCode}`
  }
}
