import * as express from 'express'
import { Forbidden } from 'http-errors'

export const authorize: () => express.RequestHandler = () => {
  return (req: express.Request, resp, next) => {
    if (req.authenticated !== undefined) {
      next()
    } else {
      next(new Forbidden('Permission denied'))
    }
  }
}
