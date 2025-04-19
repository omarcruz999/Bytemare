import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  org_name: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: Number
  },
  email: {
    type: String
  },
  description: {
    type: String
  },
  // References to opportunities hosted by this organization
  opportunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  }]
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema, 'organizations');

export default Organization; 