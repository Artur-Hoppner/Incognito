const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the event Schema
const EventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  typeOfEvent: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  participant: {
    type: Array,
    required: false,
  },
  likes: {
    type: Array,
    required: false,
  },
  comments: {
    type: Array,
    required: false,
  },
});

module.exports = Events = mongoose.model('events', EventSchema);
