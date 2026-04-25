import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  userId: mongoose.Types.ObjectId;
  vehicleId: string;
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
  
  // KYC Documents
  documents: {
    registrationCertificate: string;
    insuranceCopy: string;
    permitCopy?: string;
    taxCopy?: string;
    vehicleImages: string[];
  };

  parkingLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  
  adOptions: string[]; // Left, Right doors, front bonnet, Rear door, Roof carrier handles
  status: 'Pending Verification' | 'Approved' | 'Rejected' | 'Under Service' | 'Not Operational';
  isBlocked?: boolean; // Managed by admin
  serviceReason?: string;
  
  // Campaign Assignment
  activeCampaignId: mongoose.Types.ObjectId | null;
  campaignStatus: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
  
  createdAt: Date;
}

const VehicleSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: String, unique: true },
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
  travelRoutine: { type: String, required: true, enum: ['City ride', 'Outstation', 'State permit', 'All India', 'Random'] },
  averageKmPerDay: { type: Number, required: true },
  ownerName: { type: String, required: true },
  ownerContact: { type: String, required: true },
  ownerEmail: { type: String },
  
  documents: {
    registrationCertificate: { type: String },
    insuranceCopy: { type: String },
    permitCopy: { type: String },
    taxCopy: { type: String },
    vehicleImages: { type: [String], default: [] }
  },

  parkingLocation: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  
  adOptions: { type: [String], default: [] },
  status: { type: String, default: 'Pending Verification', enum: ['Pending Verification', 'Approved', 'Rejected', 'Under Service', 'Not Operational'] },
  isBlocked: { type: Boolean, default: false },
  serviceReason: { type: String },
  
  activeCampaignId: { type: Schema.Types.ObjectId, ref: 'AdvertiserProfile', default: null },
  campaignStatus: { type: String, enum: ['NONE', 'PENDING', 'ACCEPTED', 'REJECTED'], default: 'NONE' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);

