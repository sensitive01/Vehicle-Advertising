import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  mobileNumber: string;
  email: string;
  accountType: string;
  passwordHash: string;
  isProfileComplete: boolean;
  isBlocked: boolean;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accountType: { type: String, required: true, enum: ['fleet', 'advertiser', 'admin'] },
  passwordHash: { type: String, required: true },
  isProfileComplete: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
