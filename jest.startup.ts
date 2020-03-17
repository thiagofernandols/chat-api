import * as jestCli from 'jest-cli'

import { Server } from './src/server/server'
import { environment } from './src/common/environment'
import { usersRouter } from './src/users/users.router'
import { User } from './src/users/users.model'
import { chatsRouter } from './src/chats/chats.router'
import { Chat } from './src/chats/chats.model'
import { historicRouter } from './src/historics/historics.router'
import { Historic } from './src/historics/historics.model'

declare module 'express' {
  export interface Request {
    authenticated: User
  }
}

let server: Server

const beforeAllTests = () => {
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/chat-api-test-db'
  environment.server.port = process.env.SERVER_PORT || 3001
  server = new Server()
  return server.bootstrap([
    usersRouter,
    chatsRouter,
    historicRouter
  ])
    .then(() => User.deleteMany({}).exec())
    .then(() => Chat.deleteMany({}).exec())
    .then(() => Historic.deleteMany({}).exec())
    .then(() => {
      let user = new User()
      user.nickName = 'UsuarioTeste'
      user.email = 'usuario@teste.com'
      user.birthDay = new Date()
      return user.save()
    })
}

const afterAllTests = () => {
  return server.shutdown()
}

beforeAllTests()
  .then(() => jestCli.run())
  .then(() => afterAllTests())
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
