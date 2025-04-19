import { Router } from 'express';
import Volunteer from '../models/Volunteer';

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

export default router; 