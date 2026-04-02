import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminSetting extends Document {
  // One-time Costs
  defaultDesignCharge: number;
  printingChargePerVehicleType: {
    type: string; // 'Auto', 'Car', 'Bus'
    charge: number;
  }[];
  installationChargePerVehicleType: {
    type: string; 
    charge: number;
  }[];
  transportChargePerVehicleType: {
    type: string;
    charge: number;
  }[];

  // Recurring Costs
  rentalPerKmPerVehicleType: {
    type: string;
    charge: number;
  }[];

  // Global Settings
  defaultGstPercentage: number;
  serviceChargePercentage: number;
  minCampaignDuration: number; // in months
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const AdminSettingSchema: Schema = new Schema({
  defaultDesignCharge: { type: Number, default: 0 },
  printingChargePerVehicleType: [{
    type: { type: String },
    charge: { type: Number, default: 0 }
  }],
  installationChargePerVehicleType: [{
    type: { type: String },
    charge: { type: Number, default: 0 }
  }],
  transportChargePerVehicleType: [{
    type: { type: String },
    charge: { type: Number, default: 0 }
  }],
  rentalPerKmPerVehicleType: [{
    type: { type: String },
    charge: { type: Number, default: 0 }
  }],
  defaultGstPercentage: { type: Number, default: 18 },
  serviceChargePercentage: { type: Number, default: 10 },
  minCampaignDuration: { type: Number, default: 3 },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.AdminSetting || mongoose.model<IAdminSetting>('AdminSetting', AdminSettingSchema);
