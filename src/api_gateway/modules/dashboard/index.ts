import { dashboardRoutes } from './routes'
import path = require('path')

export default function dashboard ({ hook }): void {
  hook('butterfly:registerViewPaths', (paths: string[]): void => {
    paths.push(path.join(__dirname, '/views'))
  })

  hook('butterfly:drawRoutes', dashboardRoutes)
}
