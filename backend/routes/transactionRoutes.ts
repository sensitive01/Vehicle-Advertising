import express from 'express';
import Transaction from '../model/Transaction';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/user/:userId', verifyToken, async (req: any, res: any) => {
  try {
    const role = req.user.role;
    if (role !== 'superadmin' && role !== 'SuperAdmin' && req.user.id !== req.params.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const transactions = await Transaction.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/add', verifyToken, async (req: any, res: any) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
