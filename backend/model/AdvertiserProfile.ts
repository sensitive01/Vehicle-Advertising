import mongoose, { Schema, Document } from 'mongoose';

export interface IAdvertiserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  adId: string;
  brandName: string;
  businessCategory: string;
  operatingLocation: string;
  targetVehicleType: string; // e.g. 'Passenger', 'Auto', etc.
  adOptions: string[]; // Left door, Right door, etc.
  numberOfVehicles: number;
  averageRunningLocation: {
    pin: string;
    radius: number; // in KM
  };
  duration: '3 months' | '6 months' | '1 year';
  designCharges: number;
  printingCharges: number;
  serviceCharges: number;
  gst: number;
  rentalChargesPerKm: number;
  averageKm: number;
  adImages: string[];
  adDimensions?: {
    length: string;
    width: string;
  };
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'REJECTED';
  createdAt: Date;
}

const AdvertiserProfileSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adId: { type: String, unique: true },
  brandName: { type: String, required: true },
  businessCategory: { type: String, required: true },
  operatingLocation: { type: String, required: true },
  targetVehicleType: { type: String, required: true },
  adOptions: { type: [String], default: [] },
  numberOfVehicles: { type: Number, required: true },
  averageRunningLocation: {
    pin: { type: String, required: true },
    radius: { type: Number, required: true }
  },
  duration: { type: String, enum: ['3 months', '6 months', '1 year'], required: true },
  designCharges: { type: Number, default: 0 },
  printingCharges: { type: Number, default: 0 },
  serviceCharges: { type: Number, default: 0 },
  gst: { type: Number, default: 18 },
  rentalChargesPerKm: { type: Number, default: 0 },
  averageKm: { type: Number, default: 0 },
  adImages: { type: [String], default: [] },
  adDimensions: {
    length: { type: String, default: '' },
    width: { type: String, default: '' }
  },
  status: { type: String, enum: ['PENDING', 'ACTIVE', 'EXPIRED', 'REJECTED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

AdvertiserProfileSchema.pre('save', async function(next) {
  const doc = this as any;
  if (doc.isNew && !doc.adId) {
    const random = Math.floor(100000 + Math.random() * 900000);
    doc.adId = `CP${random}`;
  }
  next();
});

export default mongoose.models.AdvertiserProfile || mongoose.model<IAdvertiserProfile>('AdvertiserProfile', AdvertiserProfileSchema);
