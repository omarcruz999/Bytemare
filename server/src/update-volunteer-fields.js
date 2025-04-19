// Update script to add new fields to existing volunteers
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define schema for the update
const volunteerSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  email: String,
  volunteering: Object,
  history: Array,
  aboutMe: {
    type: String,
    default: ''
  },
  preferredCategories: {
    type: [String],
    default: []
  }
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema, 'volunteers');

// Sample about me texts
const sampleAboutMe = [
  "Passionate about making a difference in my community. I love working with others and giving back whenever I can.",
  "I believe in the power of volunteerism to transform communities. Dedicated to environmental causes and social justice.",
  "Recent college graduate looking to make a positive impact. I enjoy outdoor activities and working with children.",
  "Retired teacher with a passion for education. I love sharing my knowledge and experience with the next generation.",
  "Software engineer by day, community volunteer by night. I believe technology can be used to solve social problems.",
  "New to the area and looking to connect with my community through volunteer work. I enjoy meeting new people and learning new skills.",
  "Long-time volunteer with experience in various causes. I believe everyone has something valuable to contribute.",
  "Business professional with a passion for mentoring and economic development. I enjoy helping others achieve their goals."
];

// Sample categories
const categories = [
  "education", "healthcare", "environment", "animal welfare", 
  "community service", "disaster relief", "elderly care", "youth development",
  "homelessness", "hunger relief", "veterans", "arts and culture",
  "park cleanup", "construction", "food distribution", "mentoring"
];

async function updateVolunteers() {
  try {
    console.log('Starting volunteer field updates...');
    
    // Find all volunteers
    const volunteers = await Volunteer.find({
      $or: [
        { aboutMe: { $exists: false } },
        { preferredCategories: { $exists: false } }
      ]
    });
    
    console.log(`Found ${volunteers.length} volunteers to update`);
    
    // Update each volunteer
    for (const volunteer of volunteers) {
      // Add aboutMe if it doesn't exist
      if (!volunteer.aboutMe) {
        const randomAboutMe = sampleAboutMe[Math.floor(Math.random() * sampleAboutMe.length)];
        volunteer.aboutMe = randomAboutMe;
      }
      
      // Add preferredCategories if it doesn't exist
      if (!volunteer.preferredCategories || volunteer.preferredCategories.length === 0) {
        // Pick 2-4 random categories
        const numCategories = Math.floor(Math.random() * 3) + 2;
        const shuffled = [...categories].sort(() => 0.5 - Math.random());
        volunteer.preferredCategories = shuffled.slice(0, numCategories);
      }
      
      await volunteer.save();
      console.log(`Updated volunteer: ${volunteer.name}`);
    }
    
    console.log('Volunteer field updates completed successfully');
    
  } catch (error) {
    console.error('Update failed:', error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

updateVolunteers(); 