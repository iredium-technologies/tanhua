import { ApplicationService } from './../../oauth2/services/application'
import express = require('express')

const router = express.Router()

router.get('/', async function applications (req, res): Promise<void> {
  const service = new ApplicationService()

  const pagination = await service.paginate({
    offset: req.query.offset,
    limit: req.query.limit,
    query: Object.assign(req.query, { deleted_at: null })
  })

  res.render('pages/oauth/applications/index.pug', { data: await pagination.getData(), meta: await pagination.getMeta() })
})

export const applications = router
