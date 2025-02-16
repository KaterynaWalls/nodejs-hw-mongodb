// src/db/models/user.js
import { model, Schema } from 'mongoose';
import { emailRegexp } from '../../constants/auth.js';

const userSchema = new Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String,
        required: true, 
        unique: true,
        match: emailRegexp,
    },
    password: {  
        type: String, 
        required: true },
  },
  { timestamps: true, versionKey: false },
);
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
export const UserCollection = model('user', userSchema);
