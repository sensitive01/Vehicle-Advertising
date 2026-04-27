import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  mobileNumber: string;
  email: string;
  accountType: string;
  passwordHash: string;
  userId: string;
  isProfileComplete: boolean;
  isBlocked: boolean;
  walletBalance: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accountType: { type: String, required: true, enum: ['fleet', 'advertiser', 'admin'] },
  passwordHash: { type: String, required: true },
  userId: { type: String, unique: true },
  isProfileComplete: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
