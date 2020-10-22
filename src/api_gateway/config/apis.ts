import { Api } from '~/src/api_gateway/types/api_config'
import YAML = require('yaml')
import { resolve } from 'path'
import fs = require('fs')

const file = fs.readFileSync(resolve(process.cwd(), 'apis.yml'), 'utf8')

export const apis = YAML.parse(file).apis.map((o): Api => {
  const { uris, host, rateLimit = [], httpsOnly } = o.attributes

  const config = {
    https: httpsOnly
  }

  return {
    host,
    uris,
    config,
    rateLimit
  }
})
