import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    patientName: { type: String, default: '' },
    patientAge: { type: Number, default: 0 },
    treatment: { type: String, default: '' },
    rating: { type: Number, default: 5 },
    date: { type: String, default: '' },
    comment: { type: String, default: '' },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
