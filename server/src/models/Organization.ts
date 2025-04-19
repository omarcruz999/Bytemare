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
  }],
  // Add organization logo/image URL
  logoImage: {
    type: String,
    default: 'https://via.placeholder.com/150'
  }
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema, 'organizations');

export default Organization; 