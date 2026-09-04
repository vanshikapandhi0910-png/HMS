import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, default: 'General Ward' },
    ratePerNight: { type: Number, default: 1200 },
    status: { type: String, enum: ['Occupied', 'Available'], default: 'Available' },
    patientName: { type: String, default: '-' },
    nurseAssigned: { type: String, default: '-' },
  },
  { timestamps: true }
);

export default mongoose.model('Room', roomSchema);
