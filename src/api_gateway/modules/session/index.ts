import { ClearSessionForm } from './middlewares/clear_session_form'
import { Session } from './middlewares/session'
import { SessionUser } from './middlewares/session_user'

export default function accounts ({ hook }): void {
  hook('butterfly:registerMiddlewares', (middlewares): void => {
    middlewares.unshift(new SessionUser())
    middlewares.unshift(new ClearSessionForm())
    middlewares.unshift(new Session())
  })
}
