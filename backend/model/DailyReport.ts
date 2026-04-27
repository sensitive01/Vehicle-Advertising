import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyReport extends Document {
  userId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  date: Date;
  isRunning: boolean;
  openingKm: number;
  openingProof?: string; // Image URL (1st time or special)
  closingKm: number;
  closingProof: string; // Image URL
  kmDriven: number;
  reasonIfNotRunning?: string;
  drivenBy: string;
  damageReported: boolean;
  damageProof?: string;
  damageReason?: string;
  payoutStatus: 'Pending' | 'Paid';
  payoutAmount: number;
  createdAt: Date;
}

const DailyReportSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  date: { type: Date, default: Date.now },
  isRunning: { type: Boolean, required: true },
  openingKm: { type: Number, required: true },
  openingProof: { type: String },
  closingKm: { type: Number, required: true },
  closingProof: { type: String },
  kmDriven: { type: Number, required: true },
  reasonIfNotRunning: { type: String },
  drivenBy: { type: String, required: true },
  damageReported: { type: Boolean, default: false },
  damageProof: { type: String },
  damageReason: { type: String },
  payoutStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  payoutAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.DailyReport || mongoose.model<IDailyReport>('DailyReport', DailyReportSchema);
