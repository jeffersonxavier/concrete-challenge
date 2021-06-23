const mongoose = require('mongoose');

const PhoneSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    number: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = PhoneSchema;
