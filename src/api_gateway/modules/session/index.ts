import { ClearSessionForm } from './middlewares/clear_session_form'
import { Session } from './middlewares/session'
import { SessionUser } from './middlewares/session_user'

export default function accounts ({ hook }): void {
  hook('butterfly:registerMiddlewares', (middlewares): void => {
    middlewares.push(new Session())
    middlewares.push(new ClearSessionForm())
    middlewares.push(new SessionUser())
  })
}
