import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../model/Admin';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vehicleAdDB');
    console.log('Connected to MongoDB');

    const adminEmail = 'vehicleadvertising@gmail.com';
    const plainPassword = 'admin@123';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists in the database.');
      process.exit(0);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    // Save to DB
    const newAdmin = new Admin({
      email: adminEmail,
      passwordHash: passwordHash
    });

    await newAdmin.save();
    console.log('Successfully created SuperAdmin account!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Hashed Password generated successfully.`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
