import mongoose, { Schema, Document } from 'mongoose';

export interface IFleetProfile extends Document {
  userId: mongoose.Types.ObjectId;
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
    passbookProof: string; // URL to image
  };
  createdAt: Date;
  updatedAt: Date;
}

const FleetProfileSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bankDetails: {
    accountHolderName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    bankName: { type: String, default: '' },
    branchName: { type: String, default: '' },
    passbookProof: { type: String, default: '' }
  }
}, { timestamps: true });

export default mongoose.models.FleetProfile || mongoose.model<IFleetProfile>('FleetProfile', FleetProfileSchema);
