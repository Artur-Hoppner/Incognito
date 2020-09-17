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
});

module.exports = Events = mongoose.model('events', EventSchema);
