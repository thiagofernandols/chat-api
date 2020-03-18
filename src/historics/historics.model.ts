import * as mongoose from 'mongoose'
import { Chat } from '../chats/chats.model'
import { User } from '../users/users.model'

export interface Historic extends mongoose.Document {
  chat: mongoose.Types.ObjectId | Chat,
  user: mongoose.Types.ObjectId | User,
  message: string
  dateMessage: Date
}

export interface HistoricModel extends mongoose.Model<Historic> {
  findByChat(chat: mongoose.Schema.Types.ObjectId, projection?: string): Promise<Historic>
}

const historicSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

historicSchema.statics.findByChat = function (chat: mongoose.Schema.Types.ObjectId, projection: string) {
  return this.find({ chat }, projection).populate('user')
}

export const Historic = mongoose.model<Historic, HistoricModel>('Historic', historicSchema)
