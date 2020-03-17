import { ModelRouter } from '../common/model-router'
import * as express from 'express'
import * as mongoose from 'mongoose'
import { Historic } from './historics.model'
import { authorize } from '../security/authz.handler'


class HistoricRouter extends ModelRouter<Historic> {

  constructor() {
    super(Historic)
  }
  protected prepareOne(query: mongoose.DocumentQuery<Historic,Historic>): mongoose.DocumentQuery<Historic,Historic>{
    return query.populate('user')
  }

  applyRoutes(application: express.Express) {

    application.get(`${this.basePath}`, [authorize(), this.findAll])
    application.get(`${this.basePath}/:id`, [authorize(), this.validateId, this.findById])
    application.post(`${this.basePath}`, [authorize(), this.save])
    application.put(`${this.basePath}/:id`, [authorize(), this.validateId, this.replace])
    application.patch(`${this.basePath}/:id`, [authorize(), this.validateId, this.update])
    application.delete(`${this.basePath}/:id`, [authorize(), this.validateId, this.delete])
  }
}

export const historicRouter = new HistoricRouter()
