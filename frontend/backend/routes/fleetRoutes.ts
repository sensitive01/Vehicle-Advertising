import express from 'express';
import Vehicle from '../model/Vehicle';
import User from '../model/User';
import { verifyToken } from '../middleware/authMiddleware';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/upload', upload.single('file'), async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });
    
    const streamUpload = (req: any) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'vehicle_ads' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result: any = await streamUpload(req);
    res.status(200).json({ secure_url: result.secure_url });
  } catch (error: any) {
    console.error('Cloudinary backend upload error:', error);
    res.status(500).json({ error: { message: error.message || 'Failed to complete server-side upload' } });
  }
});

router.post('/add', verifyToken, async (req: any, res: any) => {
  try {
    const { vehicles } = req.body; 
    
    if (!vehicles || vehicles.length === 0) {
      return res.status(400).json({ success: false, message: 'No vehicle data provided' });
    }

    const payload = vehicles.map((v: any) => ({
      userId: req.user.id,
      ...v,
      images: Array.isArray(v.images) ? v.images : []
    }));

    await Vehicle.insertMany(payload);

    await User.findByIdAndUpdate(req.user.id, { isProfileComplete: true });

    res.status(201).json({ success: true, message: 'Vehicles added successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error adding vehicles' });
  }
});

router.get('/myfleet', verifyToken, async (req: any, res: any) => {
  try {
    const myVehicles = await Vehicle.find({ userId: req.user.id }).populate('activeCampaignId');
    res.status(200).json({ success: true, data: myVehicles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error retrieving fleet' });
  }
});

router.get('/user/:userId', verifyToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'superadmin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const vehicles = await Vehicle.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error retrieving user fleet' });
  }
});

router.patch('/approve/:vehicleId', verifyToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'superadmin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.vehicleId, 
      { status: 'Verified' },
      { new: true }
    );
    
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    
    res.status(200).json({ success: true, message: 'Vehicle verified successfully!', data: vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
});

router.get('/all', verifyToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'superadmin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const vehicles = await Vehicle.find().populate('userId', 'fullName mobileNumber');
    res.status(200).json({ success: true, data: vehicles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching all vehicles' });
  }
});

router.patch('/campaign-response/:id', verifyToken, async (req: any, res: any) => {
  try {
    const { status } = req.body; 
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { campaignStatus: status },
      { new: true }
    );
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    
    if (status === 'REJECTED') {
      vehicle.activeCampaignId = null;
      vehicle.campaignStatus = 'NONE';
      await vehicle.save();
    }
    res.status(200).json({ success: true, message: `Campaign response saved as ${status}`, data: vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error responding to campaign' });
  }
});

router.patch('/:id', verifyToken, async (req: any, res: any) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.userId;

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    );
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found or unauthorized' });
    res.status(200).json({ success: true, message: 'Vehicle updated successfully', data: vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating vehicle' });
  }
});

router.delete('/:id', verifyToken, async (req: any, res: any) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error deleting vehicle' });
  }
});

export default router;
