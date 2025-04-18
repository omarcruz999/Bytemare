import { Router } from 'express';
import Opportunity from '../models/Opportunity';

const router = Router();

// Get all opportunities
router.get('/', async (req, res) => {
  try {
    const opportunities = await Opportunity.find({});
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get top 10 opportunities with high urgency
router.get('/urgent', async (req, res) => {
  try {
    const urgentOpportunities = await Opportunity.find({ urgency: 'high' })
      .limit(10);
    
    res.json(urgentOpportunities);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get opportunities by location/city
router.get('/location/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const opportunities = await Opportunity.find({ location: city });
    
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create a new opportunity
router.post('/', async (req, res) => {
  try {
    const { org_name, category, location, type_of_work, urgency, description, image } = req.body;
    
    const opportunity = new Opportunity({
      org_name,
      category,
      location,
      type_of_work,
      urgency,
      description,
      image: image || 'https://via.placeholder.com/300x200'
    });
    
    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Update an opportunity
router.put('/:id', async (req, res) => {
  try {
    const { org_name, category, location, type_of_work, urgency, description, image } = req.body;
    
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    
    // Update fields if provided
    if (org_name) opportunity.org_name = org_name;
    if (category) opportunity.category = category;
    if (location) opportunity.location = location;
    if (type_of_work) opportunity.type_of_work = type_of_work;
    if (urgency) opportunity.urgency = urgency;
    if (description) opportunity.description = description;
    if (image) opportunity.image = image;
    
    await opportunity.save();
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get opportunity by ID
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router; 