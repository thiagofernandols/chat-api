import * as express from 'express'
import * as mongoose from 'mongoose'
import * as cors from 'cors'

import { environment } from '../common/environment'
import { Router } from '../common/router'
import { mergePatchBodyParser } from './merge-patch.parser'
import { handleError } from './error.handler'

import { tokenParser } from '../security/token.parser'

export class Server {

  application: express.Express
  listen: any

  initializeDb(): Promise<typeof mongoose> {
    (<any>mongoose).Promise = global.Promise
    return mongoose.connect(environment.db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = express()

        this.application.use(cors({
          allowedHeaders: ['authorization', 'Content-Type'],
          exposedHeaders: ['x-custom-header']
        }))

        this.application.use(express.json())
        this.application.use(mergePatchBodyParser)
        this.application.use(tokenParser)

        for (let router of routers) {
          router.applyRoutes(this.application)
        }

        this.listen = this.application.listen(environment.server.port, () => {
          resolve(this.application)
        })

        this.application.use((err, req, res, next) => {
          handleError(err, res, next)
        })
        
      } catch (error) {
        reject(error)
      }
    })
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDb().then(() =>
      this.initRoutes(routers).then(() => this))
  }

  shutdown() {
    return mongoose.disconnect().then(() => this.listen.close())
  }

}
