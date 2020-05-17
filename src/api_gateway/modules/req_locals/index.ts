import { DefineReqLocals } from './middlewares/define_req_locals'

export default function cors ({ hook }): void {
  hook('tanhua:registerApiMiddlewares', ({middlewares}) => {
    middlewares.unshift(new DefineReqLocals())
  })
}
