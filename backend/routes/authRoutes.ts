import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../model/Admin';
import User from '../model/User';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { fullName, mobileNumber, email, accountType, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
       return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });
    
    if (existingUser || existingAdmin) {
       return res.status(400).json({ success: false, message: 'Email address is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
       fullName,
       mobileNumber,
       email,
       accountType,
       passwordHash
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'Account created successfully!' });

  } catch (error) {
     console.error('Registration error:', error);
     res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let account: any = await Admin.findOne({ email });
    let role = account ? account.role : null;
    let isAdmin = !!account;

    if (!account) {
      account = await User.findOne({ email });
      if (account && account.isBlocked) {
        return res.status(403).json({ success: false, message: 'Your account has been blocked. Please contact support.' });
      }
      role = account ? account.accountType : null;
    }

    if (!account) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: account._id, role: role },
      process.env.JWT_SECRET || 'fallback_secret_key_123',
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: { id: account._id, email: account.email, role: role, isProfileComplete: isAdmin ? true : account.isProfileComplete }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

router.get('/users', verifyToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'superadmin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const users = await User.find({}, '-passwordHash');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
});

router.patch('/users/:id/block', verifyToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'superadmin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
  } catch (error) {
    console.error('Error toggling block:', error);
    res.status(500).json({ success: false, message: 'Server error toggling block status' });
  }
});

export default router;
