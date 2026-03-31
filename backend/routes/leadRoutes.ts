import express from 'express';
import Lead from '../model/Lead';

const router = express.Router();

// POST a new lead 
router.post('/', async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    const savedLead = await newLead.save();
    res.status(201).json({ success: true, data: savedLead });
  } catch (error) {
    console.error('Error creating Lead:', error);
    res.status(500).json({ success: false, error: 'Database save failed' });
  }
});

// GET all leads for Admin Dashboard
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch leads' });
  }
});

export default router;
