import { Server } from './src/server/server'
import { usersRouter } from './src/users/users.router'
import { mainRouter } from './main.router'
import { historicRouter } from './src/historics/historics.router'
import { chatsRouter } from './src/chats/chats.router'

const server = new Server()
server.bootstrap([
  usersRouter,
  mainRouter,
  historicRouter,
  chatsRouter
]).then(server => {
  console.log('Server is listening on:', server.listen.address())  
}).catch(error => {
  console.log('Server failed to start')
  console.error(error)
  process.exit(1)
})
