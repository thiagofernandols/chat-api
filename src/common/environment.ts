export const environment = {
  server: { port: process.env.SERVER_PORT || 3000 },
  db: { url: process.env.DB_URL || 'mongodb://localhost:27017/chat-api' },
  security: {
    iss: 'chat-api-iss',
    apiSecret: process.env.API_SECERT || 'chat-api-secret-150816221206'
  }
}
