import express, { Request, Response } from 'express';
import AdminSetting from '../model/AdminSetting';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Get Current Settings
router.get('/current', verifyToken, async (req: Request, res: Response) => {
  try {
    const settings = await AdminSetting.findOne().sort({ updatedAt: -1 });
    if (!settings) {
      return res.status(404).json({ success: false, message: 'Settings not configured yet' });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching settings' });
  }
});

// Update Settings
router.post('/update', verifyToken, verifyAdmin, async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const updatedBy = user.id;
    const settingsData = {
      ...req.body,
      updatedBy,
      updatedAt: Date.now()
    };

    // Replace the settings item (or update the single one)
    const settings = await AdminSetting.findOneAndUpdate({}, settingsData, { upsert: true, new: true });
    
    res.status(200).json({ success: true, data: settings, message: 'Settings updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error updating settings' });
  }
});

export default router;
