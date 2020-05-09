import { Cors } from './middlewares/cors'

export default function cors ({ hook }): void {
  hook('tanhua:registerApiMiddlewares', ({middlewares}) => {
    middlewares.unshift(new Cors())
  })
}
