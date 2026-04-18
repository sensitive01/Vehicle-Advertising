import express from 'express';
import Lead from '../model/Lead';
import { sendQuoteEmail } from '../utils/emailService';
import { generateQuotePDF } from '../utils/pdfGenerator';

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

// UPDATE lead status or quote
router.put('/:id', async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // If status is "Quoted", send email WITH PDF to advertiser
    if (updatedLead && req.body.status === 'Quoted') {
      const pdfBuffer = await generateQuotePDF(updatedLead.contactName, updatedLead.email, req.body);
      await sendQuoteEmail(updatedLead.email, updatedLead.contactName, req.body, pdfBuffer);
    }

    res.status(200).json({ success: true, data: updatedLead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// GET DOWNLOAD PDF
router.get('/:id/download-quote', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    
    const pdfBuffer = await generateQuotePDF(lead.contactName, lead.email, lead);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=VAP_Quote_${lead.contactName.replace(/\s+/g, '_')}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download failed:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF' });
  }
});

export default router;
