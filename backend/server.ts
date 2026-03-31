import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Test Endpoint
app.get('/', (req, res) => {
    res.json({ status: 'Platform API is active', db: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Error' });
});

import leadRoutes from './routes/leadRoutes';
import authRoutes from './routes/authRoutes';
import fleetRoutes from './routes/fleetRoutes';
import reportRoutes from './routes/reportRoutes';
import advertiserRoutes from './routes/advertiserRoutes';

// Register Sub-routes
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/advertiser', advertiserRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT as number, '0.0.0.0', () => {
    console.log(`🚀 Platform server is actively listening on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vehicleAdDB', {
        serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err: any) {
    console.error('❌ MongoDB Connection Error. Please check your Atlas whitelist or connection string.');
  }
};

connectDB();
