import { Router } from './src/common/router'
import * as express from 'express'

class MainRouter extends Router {
  applyRoutes(application: express.Express) {
    application.get('/', (req, resp, next) => {
      resp.json({
        users: '/users',
        chats: '/chats',
        historics: '/historics'
      })
    })
  }
}

export const mainRouter = new MainRouter()
