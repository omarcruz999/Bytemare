import { Router } from 'express';
import Volunteer from '../models/Volunteer';
import Opportunity from '../models/Opportunity';

const router = Router();

// Get all volunteers
router.get('/', async (req, res) => {
  try {
    const volunteers = await Volunteer.find({});
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create a new volunteer from Firebase user
router.post('/', async (req, res) => {
  try {
    const { uid, name, email, phone, profileImage } = req.body;
    
    // Check if volunteer already exists with this email
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: 'Volunteer with this email already exists' });
    }
    
    // Create a new volunteer with minimal required info
    const volunteer = new Volunteer({
      firebaseUid: uid,  // Store Firebase UID for future reference
      name: name || email.split('@')[0], // Use name or fallback to email username
      email,
      phone: phone || 0,  // Default phone number if not provided
      profileImage: profileImage || 'https://via.placeholder.com/150', // Default image
      volunteering: {},  // Empty volunteering record
      history: [],  // Empty history
      aboutMe: '',  // Empty about me
      preferredCategories: []  // Empty preferred categories
    });
    
    await volunteer.save();
    res.status(201).json({ message: 'Volunteer created successfully', volunteer });
  } catch (error) {
    console.error('Error creating volunteer:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Check if a volunteer exists by email
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const volunteer = await Volunteer.findOne({ email });
    
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    
    res.json({ 
      message: 'Volunteer found',
      volunteer: {
        _id: volunteer._id,
        name: volunteer.name,
        email: volunteer.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Update volunteer profile
router.put('/:id/profile', async (req, res) => {
  try {
    const { aboutMe, preferredCategories, profileImage } = req.body;
    
    // Find the volunteer
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    
    // Update fields if provided
    if (aboutMe !== undefined) {
      volunteer.aboutMe = aboutMe;
    }
    
    if (preferredCategories !== undefined) {
      volunteer.preferredCategories = preferredCategories;
    }
    
    if (profileImage !== undefined) {
      volunteer.profileImage = profileImage;
    }
    
    // Save the volunteer
    await volunteer.save();
    
    res.json({ message: 'Profile updated successfully', volunteer });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Add an opportunity to volunteer history
router.post('/:id/history', async (req, res) => {
  try {
    const { opportunityId } = req.body;
    
    // Verify that the opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    
    // Find the volunteer
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    
    // Add to history
    volunteer.history.push({ opportunityId, date: new Date() });
    
    // Update volunteering counter for the city
    const city = opportunity.location;
    
    // Initialize volunteering object if it doesn't exist
    if (!volunteer.volunteering) {
      volunteer.volunteering = {};
    }
    
    // Update the counter for this city
    const currentCount = volunteer.volunteering[city] || 0;
    volunteer.volunteering[city] = currentCount + 1;
    
    // Save the volunteer with updated history and counter
    await volunteer.save();
    
    res.json({ message: 'History updated successfully', volunteer });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get volunteer profile with total events count and history
router.get('/profile/:id', async (req, res) => {
  try {
    // Find volunteer and populate the history with opportunity details
    const volunteer = await Volunteer.findById(req.params.id)
      .populate({
        path: 'history.opportunityId',
        model: 'Opportunity',
        select: 'org_name category location type_of_work description image'
      });
    
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    
    // Calculate total volunteering events across all cities
    let totalEvents = 0;
    
    // Sum up all event counts from the volunteering object
    if (volunteer.volunteering) {
      Object.values(volunteer.volunteering).forEach(count => {
        totalEvents += Number(count);
      });
    }
    
    // Create profile response with volunteer data and total events
    const profile = {
      _id: volunteer._id,
      name: volunteer.name,
      email: volunteer.email,
      phone: volunteer.phone,
      aboutMe: volunteer.aboutMe || '',
      preferredCategories: volunteer.preferredCategories || [],
      profileImage: volunteer.profileImage,
      totalEvents: totalEvents,
      // Include original volunteering data for reference
      eventsByCity: volunteer.volunteering,
      // Include volunteering history
      history: volunteer.history
    };
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get leaderboard by city
router.get('/leaderboard/:city', async (req, res) => {
  try {
    const city = req.params.city;
    
    // Find volunteers who have volunteered in this city
    // and sort them by the frequency/number of events in descending order
    const volunteers = await Volunteer.find({
      [`volunteering.${city}`]: { $exists: true, $gt: 0 }
    }).sort({
      [`volunteering.${city}`]: -1 // -1 for descending order
    }).limit(10); // Get top 10 volunteers
    
    // Transform the response to include just the relevant data
    const leaderboard = volunteers.map(volunteer => ({
      _id: volunteer._id,
      name: volunteer.name,
      eventsCount: volunteer.volunteering[city]
    }));
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get volunteers by location
router.get('/location/:city', async (req, res) => {
  try {
    const city = req.params.city;
    // Find volunteers who have volunteered in the specified city
    const volunteers = await Volunteer.find({
      [`volunteering.${city}`]: { $exists: true, $gt: 0 }
    });
    
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get volunteers by preferred category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    // Find volunteers who have this category in their preferred categories
    const volunteers = await Volunteer.find({
      preferredCategories: category
    });
    
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get volunteer by ID
router.get('/:id', async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router; 