import { accountsRoutes } from './routes'
import { EventListener } from '@iredium/butterfly/lib/types/config'
import path = require('path')

export default function accounts ({ hook }): void {
  hook('butterfly:registerViewPaths', (paths: string[]): void => {
    paths.push(path.join(__dirname, '/views'))
  })

  hook('butterfly:registerEventListener', (eventListenerMap: EventListener[]): void => {
    /* eslint-disable typescript/explicit-function-return-type */
    eventListenerMap.push({
      event: () => import('./events/users/created'),
      listeners: [
        () => import('./listeners/users/created')
      ]
    })
    /* eslint-enable typescript/explicit-function-return-type */
  })

  hook('butterfly:drawRoutes', accountsRoutes)
}
