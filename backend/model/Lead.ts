import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  contactName: string;
  mobileNumber: string;
  email: string;
  vehicleType: string;
  requirementDetails: string;
  status: string;
  quotedPrice?: number;
  
  // Detailed Quoting Fields
  designCharges?: number;
  printingCharges?: number;
  serviceCharges?: number;
  transportCharges?: number;
  installationCharges?: number;
  rentalPerKm?: number;
  expectedAvgKm?: number;
  gstPercentage?: number;

  createdAt: Date;
}

const LeadSchema: Schema = new Schema({
  contactName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  vehicleType: { type: String, required: true },
  requirementDetails: { type: String, required: true },
  status: { type: String, default: 'New' },
  quotedPrice: { type: Number, default: 0 },
  
  // Detailed Quoting Fields
  designCharges: { type: Number, default: 0 },
  printingCharges: { type: Number, default: 0 },
  serviceCharges: { type: Number, default: 0 },
  transportCharges: { type: Number, default: 0 },
  installationCharges: { type: Number, default: 0 },
  rentalPerKm: { type: Number, default: 0 },
  expectedAvgKm: { type: Number, default: 0 },
  gstPercentage: { type: Number, default: 18 },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ILead>('Lead', LeadSchema);
