import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  campaignId?: mongoose.Types.ObjectId;
  amount: number;
  type: 'Credit' | 'Debit';
  status: 'Pending' | 'Completed' | 'Failed';
  description: string;
  transactionId: string;
  paymentMethod: string;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Credit', 'Debit'], required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
  description: { type: String, required: true },
  transactionId: { type: String, required: true, unique: true },
  paymentMethod: { type: String, default: 'UPI' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
