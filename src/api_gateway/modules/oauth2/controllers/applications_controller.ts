import { ApplicationInterface } from './../models/application/interface'
import { ApplicationService } from '../services/application'
import { ApiController } from '@iredium/butterfly/lib/controllers'
import { ApplicationPolicy } from '../policies/application'
import { BaseResponse, ViewResponse, RedirectResponse } from '@iredium/butterfly/lib/routes'
import { accountsUrl } from '~/src/api_gateway/helpers/url'

export class ApplicationsController extends ApiController {
  public constructor () {
    super(ApplicationService, ApplicationPolicy)
  }

  public async dashboard (req): Promise<BaseResponse> {
    this.authorize('index')

    const pagination = await this.service.paginate({
      offset: req.query.offset,
      limit: req.query.limit,
      query: Object.assign(req.query, { deleted_at: null })
    })

    return new ViewResponse('pages/applications/index.pug', {
      data: await pagination.getData(),
      meta: await pagination.getMeta(),
      links: pagination.links()
    })
  }

  public async createAction (req): Promise<BaseResponse> {
    try {
      const application = await this.service.create(req.body)
      return new RedirectResponse(accountsUrl(`/oauth/applications/${application._id}/edit`))
    } catch (error) {
      req.session['form'] = req.body
      req.session['error'] = error
      return new RedirectResponse(req.header('Referer'))
    }
  }

  public async editAction (req, application: ApplicationInterface): Promise<BaseResponse> {
    try {
      const { name, redirect_uris, scope } = req.body
      application.name = name
      application.redirect_uris = redirect_uris
      application.scope = scope
      await application.save()
      return new RedirectResponse(req.header('Referer'))
    } catch (error) {
      req.session['error'] = error
      return new RedirectResponse(req.header('Referer'))
    }
  }

  public async deleteAction (req, application: ApplicationInterface): Promise<BaseResponse> {
    try {
      await this.service.delete(application)
      return new RedirectResponse(accountsUrl('/oauth/applications'))
    } catch (error) {
      return new RedirectResponse(accountsUrl('/oauth/applications'))
    }
  }

  public async createForm (req): Promise<BaseResponse> {
    return new ViewResponse('pages/applications/form.pug', {
      title: 'Create a New Application',
      body: req.session['form'],
      error: req.session['error']
    })
  }

  public async editForm (req, application: ApplicationInterface): Promise<BaseResponse> {
    return new ViewResponse('pages/applications/form.pug', {
      title: 'Edit a New Application',
      method: 'PATCH',
      body: application,
      error: req.session['error']
    })
  }
}
