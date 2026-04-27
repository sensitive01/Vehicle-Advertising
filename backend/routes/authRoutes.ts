import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../model/Admin';
import User from '../model/User';
import { verifyToken } from '../middleware/authMiddleware';

import Otp from '../model/Otp';
import { sendEmail } from '../utils/emailService';

const router = express.Router();

const generateuserId = async () => {
  let isUnique = false;
  let newId = '';
  
  while (!isUnique) {
    const randomNum = Math.floor(100000 + Math.random() * 900000); 
    newId = `VA${randomNum}`;
    const existingUser = await User.findOne({ userId: newId });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return newId;
};

// 1. Send OTP
router.post('/send-otp', async (req: Request, res: Response) => {


  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'This email is already registered. Please login.' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save/Update OTP in DB
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Send Mail
    const emailSent = await sendEmail(
      email, 
      'Your Verification Code', 
      `<div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 18px; color: #d4d4d8; margin-bottom: 25px;">Please use the following 6-digit verification code to complete your registration:</p>
        <div style="background-color: #1a1a1a; padding: 25px; border-radius: 12px; border: 1px dashed #FACC15; display: inline-block; letter-spacing: 12px; font-size: 42px; font-weight: 800; color: #FACC15;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #71717a; margin-top: 30px;">This code is valid for <b>10 minutes</b>. If you didn't request this, you can safely ignore this email.</p>
      </div>`
    );

    if (emailSent) {
      res.status(200).json({ success: true, message: 'Verification OTP sent to your email!' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error sending OTP' });
  }
});

// 2. Verify OTP
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const otpData = await Otp.findOne({ email, otp });
    if (!otpData) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // OTP is valid!
    res.status(200).json({ success: true, message: 'Email verified successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error verifying OTP' });
  }
});


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
    const userId = await generateuserId();

    const newUser = new User({
       fullName,
       mobileNumber,
       email,
       accountType,
       passwordHash,
       userId
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

router.get('/users', verifyToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    if (user.role !== 'superadmin' && user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const users = await User.find({}, '-passwordHash');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
});

router.patch('/users/:id', verifyToken, async (req: Request, res: Response) => {
  const userRole = (req as any).user.role;
  try {
    if (userRole !== 'superadmin' && userRole !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { fullName, mobileNumber, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, mobileNumber, email },
      { new: true }
    );
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, message: 'User updated successfully', data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error updating user' });
  }
});

router.patch('/users/:id/block', verifyToken, async (req: Request, res: Response) => {
  const userRole = (req as any).user.role;
  try {
    if (userRole !== 'superadmin' && userRole !== 'SuperAdmin') {
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

router.post('/change-password', verifyToken, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById((req as any).user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Incorrect current password' });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/me', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
