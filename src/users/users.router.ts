import { ModelRouter } from '../common/model-router'
import * as express from 'express'
import { User } from './users.model'
import { authenticate } from '../security/auth.handler'
import { authorize } from '../security/authz.handler'


class UsersRouter extends ModelRouter<User> {

  constructor() {
    super(User)
  }

  applyRoutes(application: express.Express) {

    application.get(`${this.basePath}`, [authorize(), this.findAll])
    application.get(`${this.basePath}/:id`, [authorize(), this.validateId, this.findById])
    application.post(`${this.basePath}`, [this.save])
    application.put(`${this.basePath}/:id`, [authorize(), this.validateId, this.replace])
    application.patch(`${this.basePath}/:id`, [authorize(), this.validateId, this.update])
    application.delete(`${this.basePath}/:id`, [authorize(), this.validateId, this.delete])

    application.post(`${this.basePath}/authenticate`, authenticate)
  }
}

export const usersRouter = new UsersRouter()
