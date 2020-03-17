import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import { Forbidden } from 'http-errors'
import { User } from '../../src/users/users.model'
import { environment } from '../../src/common/environment'

export const authenticate: express.RequestHandler = (req, resp, next) => {
  const { email } = req.body
  User.findByEmail(email)
    .then(user => {
      if (user) {
        const token = jwt.sign({ sub: user.email, iss: environment.security.iss },
          environment.security.apiSecret)
        resp.json({ _id: user._id, nickName: user.nickName, email: user.email, accessToken: token })
        return next(false)
      } else {
        return next(new Forbidden('Invalid Credentials'))
      }
    }).catch(next)
}
