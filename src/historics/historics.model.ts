import * as mongoose from 'mongoose'
import { Chat } from '../chats/chats.model'
import { User } from '../users/users.model'

export interface Historic extends mongoose.Document {
  chat: mongoose.Types.ObjectId | Chat,
  user: mongoose.Types.ObjectId | User,
  message: string
  dateMessage: Date
}

const historicSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String
  },
  dateMessage: {
    type: Date,
    required: true,
    default: new Date()
  }
})

export const Historic = mongoose.model<Historic>('Historic', historicSchema)
