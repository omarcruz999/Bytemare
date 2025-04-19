import mongoose from 'mongoose';

// Define a schema for the volunteering object
const volunteeringSchema = new mongoose.Schema({
  // Using mongoose.Schema.Types.Mixed to allow for dynamic city keys with number values
  type: Map,
  of: Number
}, { _id: false });

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
    type: Map,
    of: Number,
    default: {}
  }
}, { timestamps: true });

const Volunteer = mongoose.model('Volunteer', volunteerSchema, 'volunteers');

export default Volunteer; 