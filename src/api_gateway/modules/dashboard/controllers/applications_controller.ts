import { ApplicationPolicy } from '../policies/application'
import { ApplicationService } from '../../oauth2/services/application'
import { BaseController } from '@iredium/butterfly/lib/controllers'
import { BaseResponse, ViewResponse } from '@iredium/butterfly/lib/routes'

export class ApplicationsController extends BaseController {
  public constructor () {
    super(ApplicationService, ApplicationPolicy)
  }

  public async index (req): Promise<BaseResponse> {
    this.authorize('index')

    const service = new ApplicationService()

    const pagination = await service.paginate({
      offset: req.query.offset,
      limit: req.query.limit,
      query: Object.assign(req.query, { deleted_at: null })
    })

    return new ViewResponse('pages/oauth/applications/index.pug', {
      data: await pagination.getData(),
      meta: await pagination.getMeta()
    })
  }
}
