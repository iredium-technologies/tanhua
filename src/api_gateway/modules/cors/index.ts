import { RouteDrawer } from '@iredium/butterfly/lib/routes'
import corsMiddleware = require('cors')

function corsRoutes (route: RouteDrawer): void {
  route.use(corsMiddleware())
}

export default function cors ({ hook }): void {
  hook('butterfly:drawRoutes', corsRoutes)
}
