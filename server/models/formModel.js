const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: Number,
  type: String,
  label: String,
  options: [String],
}, { _id: false });

const formSchema = new mongoose.Schema({ //troubleshoot
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);