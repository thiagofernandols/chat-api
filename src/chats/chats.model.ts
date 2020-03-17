import * as mongoose from 'mongoose'
export interface Chat extends mongoose.Document {
  chatName: string
}

const chatSchema = new mongoose.Schema({
  chatName: {
    type: String,
    required: true,
    unique: true,
    maxlength: 80,
    minlength: 3
  }
})

export const Chat = mongoose.model<Chat>('Chat', chatSchema)
