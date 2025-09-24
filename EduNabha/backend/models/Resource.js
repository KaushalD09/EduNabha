const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['pdf', 'video', 'audio', 'link'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['english', 'punjabi', 'hindi'],
    default: 'english'
  },
  category: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resource', ResourceSchema);