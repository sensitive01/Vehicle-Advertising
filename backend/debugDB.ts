import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './model/Vehicle';

dotenv.config();

async function debugItems() {
  await mongoose.connect(process.env.MONGO_URI || '');
  const v = await Vehicle.findOne().sort({ createdAt: -1 }).lean();
  console.log('DEBUG_VEHICLE:', JSON.stringify(v, null, 2));
  await mongoose.connection.close();
}

debugItems();
