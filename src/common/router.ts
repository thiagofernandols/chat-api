import * as express from 'express'
import { EventEmitter } from 'events'
import { NotFound } from 'http-errors'

export abstract class Router extends EventEmitter {
  abstract applyRoutes(application: express.Express)

  envelope(document: any): any {
    return document
  }

  envelopeAll(documents: any[], options: any = {}): any {
    return documents
  }

  render(response: express.Response, next: express.NextFunction) {
    return (document) => {
      if (document) {
        this.emit('beforeRender', document)
        response.json(this.envelope(document))
      } else {
        throw new NotFound('Document not found')
      }
    }
  }

  renderAll(response: express.Response, next: express.NextFunction, options: any = {}) {
    return (documents: any[]) => {
      if (documents) {
        documents.forEach((document, index, array) => {
          this.emit('beforeRender', document)
          array[index] = this.envelope(document)
        })
        response.json(this.envelopeAll(documents, options))
      } else {
        response.json(this.envelopeAll([]))
      }
    }
  }



}
