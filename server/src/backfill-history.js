// Advanced migration script to backfill volunteer history
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define schemas for the migration
const opportunitySchema = new mongoose.Schema({
  org_name: String,
  category: String,
  location: String,
  type_of_work: String,
  urgency: String,
  description: String
});

const volunteerSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  email: String,
  volunteering: Object,
  history: [{ 
    opportunityId: mongoose.Schema.Types.ObjectId,
    date: Date
  }]
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema, 'opportunities');
const Volunteer = mongoose.model('Volunteer', volunteerSchema, 'volunteers');

async function backfillHistory() {
  try {
    console.log('Starting history backfill...');
    
    // Find all volunteers
    const volunteers = await Volunteer.find();
    console.log(`Found ${volunteers.length} volunteers to process`);
    
    // Process each volunteer
    for (const volunteer of volunteers) {
      console.log(`Processing volunteer: ${volunteer.name}`);
      
      // Skip if they already have history entries
      if (volunteer.history && volunteer.history.length > 0) {
        console.log('  Volunteer already has history entries, skipping.');
        continue;
      }
      
      // Initialize history array if it doesn't exist
      if (!volunteer.history) {
        volunteer.history = [];
      }
      
      // For each city in their volunteering object
      for (const [city, count] of Object.entries(volunteer.volunteering || {})) {
        console.log(`  Processing city: ${city} (${count} events)`);
        
        // Find opportunities in this city
        const cityOpportunities = await Opportunity.find({ location: city });
        
        if (cityOpportunities.length === 0) {
          console.log(`  No opportunities found in ${city}, skipping.`);
          continue;
        }
        
        // Create synthetic history entries
        // We'll use a random selection of opportunities from this city
        const historyCount = Math.min(count, cityOpportunities.length);
        
        for (let i = 0; i < historyCount; i++) {
          // Select a random opportunity from this city
          const randomIndex = Math.floor(Math.random() * cityOpportunities.length);
          const opportunity = cityOpportunities[randomIndex];
          
          // Create history entry with random date in the past (up to 1 year ago)
          const randomDaysAgo = Math.floor(Math.random() * 365);
          const date = new Date();
          date.setDate(date.getDate() - randomDaysAgo);
          
          volunteer.history.push({
            opportunityId: opportunity._id,
            date: date
          });
          
          console.log(`  Added history: ${opportunity.org_name} - ${opportunity.type_of_work}`);
        }
      }
      
      // Sort history by date (newest first)
      volunteer.history.sort((a, b) => b.date - a.date);
      
      // Save the volunteer with the new history
      await volunteer.save();
      console.log(`  Saved volunteer with ${volunteer.history.length} history entries`);
    }
    
    console.log('History backfill completed successfully');
    
  } catch (error) {
    console.error('Backfill failed:', error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

backfillHistory(); 