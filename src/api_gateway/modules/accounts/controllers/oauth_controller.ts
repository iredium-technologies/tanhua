import { BaseError } from '@iredium/butterfly/lib/errors'
import { UserService } from './../services/user'
import { ApiController } from '@iredium/butterfly/lib/controllers'
import { OauthPolicy } from '../policies/oauth'
import { BaseResponse } from '@iredium/butterfly/lib/routes/responses/base_response'
import { JsonResponse } from '@iredium/butterfly/lib/routes/responses/json'
import axios, { AxiosInstance } from 'axios'

export class OauthController extends ApiController {
  protected axios: AxiosInstance
  protected service: UserService

  public constructor () {
    super(UserService, OauthPolicy)
    this.axios = axios.create({
      timeout: 10000
    })
  }

  public async token (req): Promise<BaseResponse> {
    this.authorize('token')
    const url = `http://localhost:${process.env.PORT}/credentials`
    let user = null

    if (req.body.grant_type === 'password') {
      if (!(req.body.username && req.body.password) && !(req.body.email && req.body.password)) {
        throw new BaseError('Invalid login request', 'username and password are required')
      }
      user = await this.service.authenticate('password', {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      })
    }

    const data = {
      grant_type: req.body.grant_type,
      client_id: req.body.client_id,
      client_secret: req.body.client_secret,
      scope: req.body.scope,
      authenticated_user_id: user ? user._id : null,
      refresh_token: req.body.refresh_token,
      code: req.body.code,
      redirect_uri: req.body.redirect_uri
    }

    const { data: { data: credential } } = await this.axios.post(url, data, {
      headers: {
        'x-request-id': req['locals']['requestId']
      }
    })

    return new JsonResponse(credential)
  }
}
