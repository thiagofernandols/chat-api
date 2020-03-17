import { ModelRouter } from '../common/model-router'
import * as express from 'express'
import { Chat } from './chats.model'
import { authorize } from '../security/authz.handler'


class ChatsRouter extends ModelRouter<Chat> {

  constructor() {
    super(Chat)
  }

  findByName = (req, resp, next) => {
    if (req.query.name) {
      Chat.findOne({ chatName: req.query.name })
        .then(chat => chat ? [chat] : [])
        .then(this.renderAll(resp, next))
        .catch(next)
    } else {
      next()
    }
  }

  applyRoutes(application: express.Express) {

    application.get(`${this.basePath}`, [this.findByName, this.findAll])
    application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
    application.post(`${this.basePath}`, [this.save])
    application.put(`${this.basePath}/:id`, [authorize(), this.validateId, this.replace])
    application.patch(`${this.basePath}/:id`, [authorize(), this.validateId, this.update])
    application.delete(`${this.basePath}/:id`, [authorize(), this.validateId, this.delete])
  }
}

export const chatsRouter = new ChatsRouter()
