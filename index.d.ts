import { User } from './src/users/users.model'

declare module 'express' {
  export interface Request {
    authenticated: User
  }
}
