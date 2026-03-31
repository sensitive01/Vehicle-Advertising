import express from 'express';
import AdvertiserProfile from '../model/AdvertiserProfile';
import User from '../model/User';
import { verifyToken } from '../middleware/authMiddleware';
import mongoose from 'mongoose';
import Vehicle from '../model/Vehicle';

const router = express.Router();

router.post('/complete-profile', verifyToken, async (req: any, res: any) => {
  try {
    const profileData = {
      userId: req.user.id,
      ...req.body
    };

    const profile = new AdvertiserProfile(profileData);
    await profile.save();

    // Mark user profile as complete
    await User.findByIdAndUpdate(req.user.id, { isProfileComplete: true });

    res.status(201).json({ success: true, message: 'Advertiser profile completed successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error completing profile' });
  }
});

router.get('/my-campaigns', verifyToken, async (req: any, res: any) => {
  try {
    const campaigns = await AdvertiserProfile.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: campaigns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching campaigns' });
  }
});

router.get('/all', verifyToken, async (req: any, res: any) => {
  try {
    const profiles = await AdvertiserProfile.find().populate('userId', 'fullName email mobileNumber');
    res.status(200).json({ success: true, data: profiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching all profiles' });
  }
});

router.patch('/status/:id', verifyToken, async (req: any, res: any) => {
  try {
    const { status } = req.body;
    const profile = await AdvertiserProfile.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating status' });
  }
});

router.post('/assign-vehicles', verifyToken, async (req: any, res: any) => {
  try {
    const { campaignId, vehicleIds } = req.body;
    const cid = new mongoose.Types.ObjectId(campaignId);
    const vids = (vehicleIds || []).map((id: string) => new mongoose.Types.ObjectId(id));

    console.log(`[SYNC] Campaign: ${cid} | Target Vehicles: ${vids.length}`);

    // Step 1: CLEAR all existing assignments for THIS campaign (Full Reset for this campaign)
    const revokeResult = await Vehicle.updateMany(
      { activeCampaignId: cid },
      { activeCampaignId: null, campaignStatus: 'NONE' }
    );
    console.log(`[SYNC] Revoked existing links for ${revokeResult.modifiedCount} vehicles`);

    // Step 2: Set assignments ONLY for the current 'vids' list
    let assignResult = { modifiedCount: 0 };
    if (vids.length > 0) {
      assignResult = await Vehicle.updateMany(
        { _id: { $in: vids } },
        { activeCampaignId: cid, campaignStatus: 'PENDING' }
      );
    }
    console.log(`[SYNC] Linked ${assignResult.modifiedCount} vehicles`);

    res.status(200).json({ 
      success: true, 
      message: `Sync complete. ${revokeResult.modifiedCount} revoked, ${assignResult.modifiedCount} matched.`,
      revoked: revokeResult.modifiedCount,
      assigned: assignResult.modifiedCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error assigning vehicles' });
  }
});

export default router;
