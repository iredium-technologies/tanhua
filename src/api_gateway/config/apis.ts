import { Api } from '~/src/api_gateway/types/api_config'
import YAML from 'yaml'
import { resolve } from 'path'
import fs = require('fs')

const file = fs.readFileSync(resolve(process.env.PWD, 'apis.yml'), 'utf8')

export const apis = YAML.parse(file).apis.map((o): Api => {
  const { uris, host } = o.attributes

  const config = {
    https: o.attributes.https_only
  }

  return {
    host,
    uris,
    config
  }
})
