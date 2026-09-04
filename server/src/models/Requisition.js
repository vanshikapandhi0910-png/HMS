import mongoose from 'mongoose';

const requisitionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    submittedById: { type: String, default: '' },
    submittedBy: { type: String, default: '' },
    role: { type: String, default: '' },
    dept: { type: String, default: '' },
    itemName: { type: String, default: '' },
    quantity: { type: Number, default: 1 },
    reason: { type: String, default: '' },
    date: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Requisition', requisitionSchema);
