import express from 'express';
import User from '../model/User';
import Vehicle from '../model/Vehicle';
import Lead from '../model/Lead';
import Campaign from '../model/Campaign';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/stats', verifyToken, async (req: any, res: any) => {
  try {
    // Check if user has admin/superadmin role
    const role = req.user.role;
    if (role !== 'superadmin' && role !== 'SuperAdmin' && role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }

    const [
      totalUsers,
      fleetOwners,
      advertisers,
      totalVehicles,
      pendingVehicles,
      approvedVehicles,
      totalLeads,
      activeCampaigns
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ accountType: 'fleet' }),
      User.countDocuments({ accountType: 'advertiser' }),
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ status: 'Pending Verification' }),
      Vehicle.countDocuments({ status: { $in: ['Approved', 'Verified'] } }),
      Lead.countDocuments(),
      Campaign.countDocuments({ status: 'Active' })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        fleetOwners,
        advertisers,
        totalVehicles,
        pendingVehicles,
        approvedVehicles,
        totalLeads,
        activeCampaigns
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: 'Server error fetching statistics' });
  }
});

export default router;
