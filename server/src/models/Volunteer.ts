import mongoose from 'mongoose';

// Define a schema for volunteer history entries
const historyEntrySchema = new mongoose.Schema({
  opportunityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  volunteering: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Add volunteering history array
  history: [historyEntrySchema]
}, { timestamps: true });

const Volunteer = mongoose.model('Volunteer', volunteerSchema, 'volunteers');

export default Volunteer; 