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