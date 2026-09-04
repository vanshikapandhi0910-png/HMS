import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    patientId: { type: String, default: '' },
    description: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    status: { type: String, enum: ['Paid', 'Pending Payment'], default: 'Pending Payment' },
  },
  { timestamps: true }
);

export default mongoose.model('Bill', billSchema);
