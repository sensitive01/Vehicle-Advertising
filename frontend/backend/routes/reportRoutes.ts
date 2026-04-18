import express from 'express';
import DailyReport from '../model/DailyReport';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/submit', verifyToken, async (req: any, res: any) => {
  try {
    const { 
      vehicleId, isRunning, openingKm, openingProof, 
      closingKm, closingProof, drivenBy, reasonIfNotRunning,
      damageReported, damageProof, damageReason 
    } = req.body;

    if (isRunning && closingKm < openingKm) {
      return res.status(400).json({ success: false, message: 'Closing KM cannot be less than Opening KM' });
    }

    const kmDriven = isRunning ? (closingKm - openingKm) : 0;

    const newReport = new DailyReport({
      userId: req.user.id,
      vehicleId,
      isRunning,
      openingKm,
      openingProof,
      closingKm,
      closingProof,
      kmDriven,
      drivenBy,
      reasonIfNotRunning,
      damageReported,
      damageProof,
      damageReason
    });

    await newReport.save();
    res.status(201).json({ success: true, message: 'Daily report submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error submitting report' });
  }
});

router.get('/last-km/:vehicleId', verifyToken, async (req: any, res: any) => {
  try {
    const lastReport = await DailyReport.findOne({ vehicleId: req.params.vehicleId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, lastClosingKm: lastReport ? lastReport.closingKm : 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching last KM data' });
  }
});

router.get('/myreports', verifyToken, async (req: any, res: any) => {
  try {
    const reports = await DailyReport.find({ userId: req.user.id }).populate('vehicleId').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching reports' });
  }
});

router.get('/all', verifyToken, async (req: any, res: any) => {
  try {
    const reports = await DailyReport.find().populate('userId', 'fullName email').populate('vehicleId').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching all reports' });
  }
});

export default router;
