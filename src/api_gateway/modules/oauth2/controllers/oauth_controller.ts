import { OauthPolicy } from '../policies/oauth'
import { ApplicationService } from '../services/application'
import { BaseController } from '@iredium/butterfly/lib/controllers'
import { BaseResponse, ViewResponse } from '@iredium/butterfly/lib/routes'

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
}
