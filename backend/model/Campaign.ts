import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  advertiserId: mongoose.Types.ObjectId;
  campaignTitle: string;
  vehicleCategory: 'Passenger' | 'Goods';
  vehicleTypes: string[]; // ['Auto', 'Car', 'TT']
  adPlacements: string[]; // ['Left door', 'Right door', 'Front bonnet', 'Rear door', 'Roof carrier handles']
  minVehicles: number;
  duration: '3 months' | '6 months' | '1 year';
  operatingLocations: string[]; // Multi-city support
  targetRadius: number; // in KM
  targetCenter: {
    lat: number;
    lng: number;
    address: string;
  };
  
  // Pricing Breakdown (Calculated from AdminSettings)
  pricing: {
    designCharges: number;
    printingCharges: number;
    serviceCharges: number;
    transportCharges: number;
    installationCharges: number;
    rentalPerKm: number;
    gstPercentage: number;
    estimatedTotal: number;
  };

  creatives: {
    id: string;
    url: string;
    placement: string;
    status: 'Pending' | 'Approved' | 'Rejected';
  }[];

  status: 'Draft' | 'Pending Approval' | 'Active' | 'Paused' | 'Completed' | 'Rejected';
  createdAt: Date;
  startDate?: Date;
  endDate?: Date;
}

const CampaignSchema: Schema = new Schema({
  advertiserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  campaignTitle: { type: String, required: true },
  vehicleCategory: { type: String, enum: ['Passenger', 'Goods'], required: true },
  vehicleTypes: { type: [String], default: [] },
  adPlacements: { type: [String], default: [] },
  minVehicles: { type: Number, default: 1 },
  duration: { type: String, enum: ['3 months', '6 months', '1 year'], required: true },
  operatingLocations: { type: [String], default: [] },
  targetRadius: { type: Number, default: 5 },
  targetCenter: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String }
  },
  pricing: {
    designCharges: { type: Number, default: 0 },
    printingCharges: { type: Number, default: 0 },
    serviceCharges: { type: Number, default: 0 },
    transportCharges: { type: Number, default: 0 },
    installationCharges: { type: Number, default: 0 },
    rentalPerKm: { type: Number, default: 0 },
    gstPercentage: { type: Number, default: 18 },
    estimatedTotal: { type: Number, default: 0 }
  },
  creatives: [{
    id: { type: String },
    url: { type: String },
    placement: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
  }],
  status: { type: String, enum: ['Draft', 'Pending Approval', 'Active', 'Paused', 'Completed', 'Rejected'], default: 'Draft' },
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
