import * as express from 'express'
import { BadRequest } from 'http-errors'

export const mergePatchBodyParser = (req: express.Request, resp: express.Response, next) => {
  if (req.method === 'PATCH') {
    (<any>req).rawBody = req.body
    try {
      req.body = req.body
    } catch (e) {
      return next(new BadRequest(`Invalid content: ${e.message}`))
    }
  }
  return next()
}
