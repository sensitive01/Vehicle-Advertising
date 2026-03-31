import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  contactName: string;
  mobileNumber: string;
  email: string;
  vehicleType: string;
  requirementDetails: string;
  status: string;
  createdAt: Date;
}

const LeadSchema: Schema = new Schema({
  contactName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  vehicleType: { type: String, required: true },
  requirementDetails: { type: String, required: true },
  status: { type: String, default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ILead>('Lead', LeadSchema);
