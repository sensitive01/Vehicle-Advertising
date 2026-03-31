import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  userId: mongoose.Types.ObjectId;
  registrationNumber: string;
  registrationType: 'Personal' | 'Yellow board';
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Others';
  vehicleCategory: 'Passenger' | 'Goods';
  passengerSubtype?: string; 
  goodsSubtype?: string;
  carSubtype?: string; // If Passenger & Car/Jeep
  seatingCapacity?: number;
  make: string; // Brand
  vehicleModel: string;
  variant: string;
  color: string;
  travelRoutine: string;
  averageKmPerDay: number;
  ownerName: string;
  ownerContact: string;
  ownerEmail?: string;
  vehicleProof?: string; // Image URL/Path
  parkingLocation: string;
  adOptions: string[]; // Left, Right doors, front bonnet, Rear door, Roof carrier handles
  images: string[];
  status: string;
  isBlocked?: boolean; // Managed by admin
  isOperatable: boolean; // Managed by owner
  serviceReason?: string;
  createdAt: Date;
}

const VehicleSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  registrationNumber: { type: String, required: true },
  registrationType: { type: String, required: true, enum: ['Personal', 'Yellow board'] },
  fuelType: { type: String, required: true, enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Others'] },
  vehicleCategory: { type: String, required: true, enum: ['Passenger', 'Goods'] },
  passengerSubtype: { type: String },
  goodsSubtype: { type: String },
  carSubtype: { type: String },
  seatingCapacity: { type: Number },
  make: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  variant: { type: String, required: true },
  color: { type: String, required: true },
  travelRoutine: { type: String, required: true },
  averageKmPerDay: { type: Number, required: true },
  ownerName: { type: String, required: true },
  ownerContact: { type: String, required: true },
  ownerEmail: { type: String },
  vehicleProof: { type: String },
  parkingLocation: { type: String, required: true },
  adOptions: { type: [String], default: [] },
  images: { type: [String], default: [] },
  status: { type: String, default: 'Pending Verification' },
  isBlocked: { type: Boolean, default: false },
  isOperatable: { type: Boolean, default: true },
  serviceReason: { type: String },
  activeCampaignId: { type: Schema.Types.ObjectId, ref: 'AdvertiserProfile', default: null },
  campaignStatus: { type: String, enum: ['NONE', 'PENDING', 'ACCEPTED', 'REJECTED'], default: 'NONE' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);
