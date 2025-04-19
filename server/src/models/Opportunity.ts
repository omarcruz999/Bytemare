import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  org_name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type_of_work: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200'
  }
}, { timestamps: true });

const Opportunity = mongoose.model('Opportunity', opportunitySchema, 'opportunities');

export default Opportunity; 