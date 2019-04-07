import { accountsRoutes } from './routes'

export default function accounts ({ hook }): void {
  hook('butterfly:drawRoutes', accountsRoutes)
}
