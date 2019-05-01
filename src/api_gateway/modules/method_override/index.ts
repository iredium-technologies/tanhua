import { MethodOverride } from './middlewares/method_override'

export default function oauth2 ({ hook }): void {
  hook('butterfly:registerMiddlewares', (middlewares): void => {
    middlewares.push(new MethodOverride())
  })
}
