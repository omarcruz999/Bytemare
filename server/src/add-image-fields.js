// Script to add image fields to existing data
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
  description: String,
  image: String
});

const volunteerSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  email: String,
  volunteering: Object,
  history: Array,
  aboutMe: String,
  preferredCategories: [String],
  profileImage: String
});

const organizationSchema = new mongoose.Schema({
  org_name: String,
  phone: Number,
  email: String,
  description: String,
  opportunities: Array,
  logoImage: String
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema, 'opportunities');
const Volunteer = mongoose.model('Volunteer', volunteerSchema, 'volunteers');
const Organization = mongoose.model('Organization', organizationSchema, 'organizations');

// Sample opportunity images based on category
const opportunityImages = {
  'education': [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=300&h=200'
  ],
  'community': [
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=200',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=300&h=200'
  ],
  'city': [
    'https://images.unsplash.com/photo-1577130740064-35eda626f276?w=300&h=200',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&h=200'
  ],
  'environment': [
    'https://images.unsplash.com/photo-1526951521990-620dc14c214b?w=300&h=200',
    'https://images.unsplash.com/photo-1516914589966-84e17e70a20d?w=300&h=200'
  ],
  'default': [
    'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=300&h=200',
    'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=300&h=200'
  ]
};

// Sample volunteer profile images
const volunteerProfileImages = [
  'https://randomuser.me/api/portraits/men/1.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/men/3.jpg',
  'https://randomuser.me/api/portraits/women/4.jpg',
  'https://randomuser.me/api/portraits/men/5.jpg',
  'https://randomuser.me/api/portraits/women/6.jpg',
  'https://randomuser.me/api/portraits/men/7.jpg',
  'https://randomuser.me/api/portraits/women/8.jpg',
  'https://randomuser.me/api/portraits/men/9.jpg',
  'https://randomuser.me/api/portraits/women/10.jpg'
];

// Sample organization logo images
const organizationLogoImages = [
  'https://logo.clearbit.com/redcross.org',
  'https://logo.clearbit.com/habitat.org',
  'https://logo.clearbit.com/foodbank.org',
  'https://logo.clearbit.com/sierraclub.org',
  'https://logo.clearbit.com/ymca.org',
  'https://logo.clearbit.com/unitedway.org',
  'https://logo.clearbit.com/doctorswithoutborders.org',
  'https://logo.clearbit.com/nature.org',
  'https://logo.clearbit.com/charitywater.org',
  'https://logo.clearbit.com/worldwildlife.org'
];

function getRandomImage(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function addImages() {
  try {
    console.log('Starting image field update...');
    
    // Update opportunities
    const opportunities = await Opportunity.find({ image: { $exists: false } });
    console.log(`Found ${opportunities.length} opportunities to update`);
    
    for (const opportunity of opportunities) {
      // Select image based on category if available
      const categoryImages = opportunityImages[opportunity.category] || opportunityImages.default;
      opportunity.image = getRandomImage(categoryImages);
      await opportunity.save();
      console.log(`Updated opportunity: ${opportunity.org_name} - ${opportunity.type_of_work}`);
    }
    
    // Update volunteers
    const volunteers = await Volunteer.find({ profileImage: { $exists: false } });
    console.log(`Found ${volunteers.length} volunteers to update`);
    
    for (const volunteer of volunteers) {
      volunteer.profileImage = getRandomImage(volunteerProfileImages);
      await volunteer.save();
      console.log(`Updated volunteer: ${volunteer.name}`);
    }
    
    // Update organizations
    const organizations = await Organization.find({ logoImage: { $exists: false } });
    console.log(`Found ${organizations.length} organizations to update`);
    
    for (const organization of organizations) {
      organization.logoImage = getRandomImage(organizationLogoImages);
      await organization.save();
      console.log(`Updated organization: ${organization.org_name}`);
    }
    
    console.log('Image field update completed successfully');
    
  } catch (error) {
    console.error('Update failed:', error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

addImages(); 