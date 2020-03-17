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

  findByChat = (req, resp, next) => {
    if (req.params.id) {
      Historic.findByChat(req.params.id)
        .then(historic => historic ? historic : [])
        .then(this.renderAll(resp, next))
        .catch(next)
    } else {
      next()
    }
  }

  applyRoutes(application: express.Express) {

    application.get(`${this.basePath}`, [this.findAll])
    application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
    application.get(`${this.basePath}/chat/:id`, [this.validateId, this.findByChat])
    application.post(`${this.basePath}`, [authorize(), this.save])
    application.put(`${this.basePath}/:id`, [authorize(), this.validateId, this.replace])
    application.patch(`${this.basePath}/:id`, [authorize(), this.validateId, this.update])
    application.delete(`${this.basePath}/:id`, [authorize(), this.validateId, this.delete])
  }
}

export const historicRouter = new HistoricRouter()
