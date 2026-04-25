import express from 'express';
import Vehicle from '../model/Vehicle';
import User from '../model/User';
import AdvertiserProfile from '../model/AdvertiserProfile';
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

const generatevehicleId = async () => {
  let isUnique = false;
  let newId = '';
  while (!isUnique) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    newId = `VF${randomNum}`;
    const existing = await Vehicle.findOne({ vehicleId: newId });
    if (!existing) isUnique = true;
  }
  return newId;
};

const mapVehicleForFrontend = (v: any) => {
  const vehicle = v.toObject ? v.toObject() : v;
  return {
    ...vehicle,
    images: vehicle.documents?.vehicleImages || [],
    vehicleProof: vehicle.documents?.registrationCertificate || ''
  };
};

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

    const payload = [];
    for (const v of vehicles) {
      const vid = await generatevehicleId();
      payload.push({
        userId: req.user.id,
        vehicleId: vid,
        ...v,
        parkingLocation: typeof v.parkingLocation === 'string' 
          ? { address: v.parkingLocation, lat: 0, lng: 0 } 
          : (v.parkingLocation || { address: 'Not Specified', lat: 0, lng: 0 }),
        registrationType: v.registrationType || 'Personal',
        fuelType: v.fuelType || 'Petrol',
        vehicleCategory: v.vehicleCategory || 'Passenger',
        make: v.make || 'Generic',
        variant: v.variant || 'Standard',
        color: v.color || 'White',
        travelRoutine: v.travelRoutine || 'City ride',
        averageKmPerDay: Number(v.averageKmPerDay) || 0,
        ownerName: v.ownerName || 'Unknown',
        ownerContact: v.ownerContact || '0000000000',
        documents: {
          registrationCertificate: v.vehicleProof || '',
          vehicleImages: Array.isArray(v.images) ? v.images : []
        }
      });
    }

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
    const mappedVehicles = myVehicles.map(mapVehicleForFrontend);
    res.status(200).json({ success: true, data: mappedVehicles });
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

    const vehicles = await Vehicle.find({ userId: req.params.userId }).populate('activeCampaignId').sort({ createdAt: -1 });
    const mappedVehicles = vehicles.map(mapVehicleForFrontend);
    res.status(200).json({ success: true, count: vehicles.length, data: mappedVehicles });
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
      { status: 'Approved' },
      { new: true }
    );
    
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    
    res.status(200).json({ success: true, message: 'Vehicle verified successfully!', data: vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
});

router.patch('/block/:vehicleId', verifyToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'superadmin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    vehicle.isBlocked = !vehicle.isBlocked;
    await vehicle.save();

    res.status(200).json({ 
      success: true, 
      message: `Vehicle ${vehicle.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      isBlocked: vehicle.isBlocked 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error toggling block' });
  }
});

router.patch('/update/:vehicleId', verifyToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'superadmin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.vehicleId, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    res.status(200).json({ success: true, data: vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating vehicle' });
  }
});

router.get('/all', verifyToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'superadmin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const vehicles = await Vehicle.find().populate('userId', 'fullName mobileNumber');
    const mappedVehicles = vehicles.map(mapVehicleForFrontend);
    res.status(200).json({ success: true, data: mappedVehicles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching all vehicles' });
  }
});

router.get('/:vehicleId/ads', verifyToken, async (req: any, res: any) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId).populate('activeCampaignId');
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    
    res.status(200).json({ 
      success: true, 
      vehicle: {
        registrationNumber: vehicle.registrationNumber,
        vehicleId: vehicle.vehicleId,
        make: vehicle.make,
        model: vehicle.vehicleModel
      },
      campaign: vehicle.activeCampaignId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching ads' });
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

    // Map frontend images/proof to backend documents schema
    if (updateData.images || updateData.vehicleProof) {
      updateData.documents = {
        ...(updateData.documents || {}),
        vehicleImages: Array.isArray(updateData.images) ? updateData.images : (updateData.documents?.vehicleImages || []),
        registrationCertificate: updateData.vehicleProof || updateData.documents?.registrationCertificate || ''
      };
    }

    // Normalize parkingLocation
    if (updateData.parkingLocation) {
      updateData.parkingLocation = typeof updateData.parkingLocation === 'string'
        ? { address: updateData.parkingLocation, lat: 0, lng: 0 }
        : updateData.parkingLocation;
    }

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
