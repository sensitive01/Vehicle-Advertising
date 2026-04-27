import express, { Request, Response } from 'express';
import Campaign from '../model/Campaign';
import AdminSetting from '../model/AdminSetting';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Calculate Campaign Estimate
router.post('/calculate-estimate', verifyToken, async (req: Request, res: Response) => {
  try {
    const { vehicleTypes, numVehicles, durationMonths } = req.body;
    
    // Fetch current admin settings
    const settings = await AdminSetting.findOne().sort({ updatedAt: -1 });
    if (!settings) {
      return res.status(404).json({ success: false, message: 'Pricing settings not configured by admin' });
    }

    let printingTotal = 0;
    let installationTotal = 0;
    let transportTotal = 0;
    let rentalPerKm = 0;

    // Calculate per vehicle type
    vehicleTypes.forEach((type: string) => {
      const p = settings.printingChargePerVehicleType.find((v: any) => v.type === type)?.charge || 0;
      const i = settings.installationChargePerVehicleType.find((v: any) => v.type === type)?.charge || 0;
      const t = settings.transportChargePerVehicleType.find((v: any) => v.type === type)?.charge || 0;
      const r = settings.rentalPerKmPerVehicleType.find((v: any) => v.type === type)?.charge || 0;

      printingTotal += p;
      installationTotal += i;
      transportTotal += t;
      rentalPerKm = Math.max(rentalPerKm, r); // Take max or average? Let's take max for now
    });

    const designCharges = settings.defaultDesignCharge;
    const subtotal = (printingTotal + installationTotal + transportTotal) * numVehicles + designCharges;
    const serviceCharges = (subtotal * settings.serviceChargePercentage) / 100;
    const gst = ((subtotal + serviceCharges) * settings.defaultGstPercentage) / 100;
    const estimatedTotal = subtotal + serviceCharges + gst;

    res.status(200).json({
      success: true,
      breakdown: {
        designCharges,
        printingCharges: printingTotal * numVehicles,
        installationCharges: installationTotal * numVehicles,
        transportCharges: transportTotal * numVehicles,
        serviceCharges,
        gst,
        rentalPerKm,
        estimatedTotal
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error calculating estimate' });
  }
});

// Create New Campaign
router.post('/create', verifyToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const campaignData = {
      advertiserId: user.id,
      ...req.body
    };

    const campaign = new Campaign(campaignData);
    await campaign.save();

    res.status(201).json({ success: true, data: campaign, message: 'Campaign created successfully as Draft!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error creating campaign' });
  }
});

// Get My Campaigns
router.get('/my-campaigns', verifyToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const campaigns = await Campaign.find({ advertiserId: user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: campaigns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching campaigns' });
  }
});

router.get('/all', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (user.role !== 'superadmin' && user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const campaigns = await Campaign.find().populate('advertiserId', 'fullName email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: campaigns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching all campaigns' });
  }
});

export default router;
