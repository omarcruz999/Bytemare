// Script to populate organizations from existing opportunities
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define schemas for the script
const opportunitySchema = new mongoose.Schema({
  org_name: String,
  category: String,
  location: String,
  type_of_work: String,
  urgency: String,
  description: String
});

const organizationSchema = new mongoose.Schema({
  org_name: {
    type: String,
    required: true,
    unique: true
  },
  phone: Number,
  email: String,
  description: String,
  opportunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  }]
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema, 'opportunities');
const Organization = mongoose.model('Organization', organizationSchema, 'organizations');

// Sample phone formats
const phoneFormats = [
  '415', '206', '503', '650', '925', '510', '408', '707', '530', '916'
];

// Sample organization descriptions
const orgDescriptions = [
  "Dedicated to improving our local communities through volunteer service. We organize events that make a real difference.",
  "A non-profit organization focused on environmental conservation and sustainability. We work to protect natural resources for future generations.",
  "Working to ensure everyone has access to educational opportunities. We provide programs and resources to underserved communities.",
  "Committed to addressing homelessness and housing insecurity. We provide shelter, food, and support services.",
  "Our mission is to promote health and wellness in communities that lack access to adequate healthcare services.",
  "A community-based organization working to improve quality of life for local residents through various service initiatives.",
  "Focused on supporting youth development through mentoring, education, and enrichment activities.",
  "An organization dedicated to animal welfare and rescue. We provide shelter, medical care, and rehoming services.",
  "Working to alleviate hunger and food insecurity through food drives, community gardens, and education programs.",
  "A civic organization committed to beautifying our cities and towns through cleanup events and infrastructure improvements."
];

// Generate a random phone number
function generatePhone(areaCode) {
  const exchange = Math.floor(Math.random() * 900) + 100; // 100-999
  const number = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  return parseInt(`${areaCode}${exchange}${number}`);
}

// Generate an email from an organization name
function generateEmail(orgName) {
  // Remove special characters and spaces, convert to lowercase
  const cleanName = orgName.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '');
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'org.com'];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  return `${cleanName}@${randomDomain}`;
}

async function populateOrganizations() {
  try {
    console.log('Starting organization population...');
    
    // Get all opportunities
    const opportunities = await Opportunity.find({});
    console.log(`Found ${opportunities.length} opportunities`);
    
    // Extract unique organization names
    const orgNames = [...new Set(opportunities.map(o => o.org_name))];
    console.log(`Found ${orgNames.length} unique organizations`);
    
    // Process each organization
    for (const orgName of orgNames) {
      // Skip if already exists
      const existingOrg = await Organization.findOne({ org_name: orgName });
      if (existingOrg) {
        console.log(`Organization "${orgName}" already exists. Updating opportunities.`);
        
        // Get all opportunities for this org
        const orgOpportunities = opportunities.filter(o => o.org_name === orgName);
        
        // Add any missing opportunities
        for (const opp of orgOpportunities) {
          if (!existingOrg.opportunities.includes(opp._id)) {
            existingOrg.opportunities.push(opp._id);
          }
        }
        
        await existingOrg.save();
        console.log(`Updated organization with ${orgOpportunities.length} opportunities`);
        continue;
      }
      
      // Generate random data for the new organization
      const areaCode = phoneFormats[Math.floor(Math.random() * phoneFormats.length)];
      const phone = generatePhone(areaCode);
      const email = generateEmail(orgName);
      const description = orgDescriptions[Math.floor(Math.random() * orgDescriptions.length)];
      
      // Get all opportunities for this organization
      const orgOpportunities = opportunities.filter(o => o.org_name === orgName);
      const opportunityIds = orgOpportunities.map(o => o._id);
      
      // Create new organization
      const newOrg = new Organization({
        org_name: orgName,
        phone,
        email,
        description,
        opportunities: opportunityIds
      });
      
      await newOrg.save();
      console.log(`Created organization "${orgName}" with ${opportunityIds.length} opportunities`);
    }
    
    console.log('Organization population completed successfully');
    
  } catch (error) {
    console.error('Population failed:', error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

populateOrganizations(); 