import mongoose, { Schema } from 'mongoose';

const DriveReportSchema = new Schema({
  vehicleId: { type: Schema.Types.ObjectId, ref: 'FleetOwner.vehicles' },
  date: { type: Date, default: Date.now },
  wasRunningToday: { type: Boolean, required: true },
  reasonIfNotRunning: { type: String },
  kmDriven: { type: Number },
  openingKm: { type: Number, required: true },
  openingProofUrl: { type: String },
  closingKm: { type: Number },
  closingProofUrl: { type: String },
  drivenBy: { type: String },
  
  // Damage reporting
  adDamageReported: { type: Boolean, default: false },
  damageProofUrl: { type: String },
  damageReason: { type: String },
  
  // Service reporting
  isUnderService: { type: Boolean, default: false },
  serviceReason: { type: String }
});

export default mongoose.model('DriveReport', DriveReportSchema);
