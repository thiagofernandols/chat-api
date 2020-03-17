import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from '../../src/users/users.model'
import { environment } from '../../src/common/environment'

export const tokenParser: express.RequestHandler = (req, resp, next) => {
  const token = extractToken(req)
  if (token) {
    jwt.verify(token, environment.security.apiSecret, applyBearer(req, next))
  } else {
    next()
  }
}

function extractToken(req) {
  let token = undefined
  const authorization = req.header('authorization')
  if (authorization) {
    const parts: string[] = authorization.split(' ')
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1]
    }
  }
  return token
}

function applyBearer(req, next): (error, decoded) => void {
  return (error, decoded) => {
    if (decoded) {
      User.findByEmail(decoded.sub).then(user => {
        if (user) {
          req.authenticated = user
        }
        next()
      }).catch(next)
    } else {
      next()
    }
  }
}
