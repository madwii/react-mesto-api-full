const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String, required: true, minlegth: 2, maxlegth: 30,
  },
  link: {
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат',
    },
    type: String,
    required: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', default: [] }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('card', cardSchema);
