import { Router } from 'express';
import Organization from '../models/Organization';
import Opportunity from '../models/Opportunity';

const router = Router();

// Get all organizations
router.get('/', async (req, res) => {
  try {
    const organizations = await Organization.find({});
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get organization by ID
router.get('/:id', async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate({
        path: 'opportunities',
        model: 'Opportunity',
        select: 'category location type_of_work urgency description image'
      });
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create a new organization
router.post('/', async (req, res) => {
  try {
    const { org_name, phone, email, description, logoImage } = req.body;
    
    // Check if organization already exists
    const existingOrg = await Organization.findOne({ org_name });
    if (existingOrg) {
      return res.status(400).json({ message: 'Organization already exists' });
    }
    
    // Create new organization
    const organization = new Organization({
      org_name,
      phone,
      email,
      description,
      logoImage: logoImage || 'https://via.placeholder.com/150',
      opportunities: []
    });
    
    await organization.save();
    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Update organization
router.put('/:id', async (req, res) => {
  try {
    const { org_name, phone, email, description, logoImage } = req.body;
    
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    // Update fields if provided
    if (org_name) organization.org_name = org_name;
    if (phone) organization.phone = phone;
    if (email) organization.email = email;
    if (description) organization.description = description;
    if (logoImage) organization.logoImage = logoImage;
    
    await organization.save();
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Add opportunity to organization
router.post('/:id/opportunities', async (req, res) => {
  try {
    const { opportunityId } = req.body;
    
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    
    // Check if already added
    if (organization.opportunities.includes(opportunityId)) {
      return res.status(400).json({ message: 'Opportunity already added to this organization' });
    }
    
    // Add opportunity to organization
    organization.opportunities.push(opportunityId);
    await organization.save();
    
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router; 