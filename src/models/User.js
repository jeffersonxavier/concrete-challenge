const mongoose = require('mongoose');
const Phone = require('./Phone');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    lastLogin: { type: Date, required: true },
    token: String,
    phones: [Phone]
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
      }
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.password;
      }
    }
  }
);

module.exports = mongoose.model('User', UserSchema);
