import * as mongoose from 'mongoose'
export interface User extends mongoose.Document {
  nickName: string,
  email: string,
  birthDay: Date
}

export interface UserModel extends mongoose.Model<User> {
  findByEmail(email: string, projection?: string): Promise<User>
}

const userSchema = new mongoose.Schema({
  nickName: {
    type: String,
    required: true,
    maxlength: 80,
    minlength: 3
  },
  email: {
    type: String,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  birthDay: {
    type: Date
  }
})

userSchema.statics.findByEmail = function (email: string, projection: string) {
  return this.findOne({ email }, projection)
}

export const User = mongoose.model<User, UserModel>('User', userSchema)
