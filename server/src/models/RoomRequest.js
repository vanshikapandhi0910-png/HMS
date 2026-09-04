import mongoose from 'mongoose';

const roomRequestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    patientId: { type: String, default: '' },
    patientName: { type: String, default: '' },
    fromRoom: { type: String, default: '' },
    toRoom: { type: String, default: '' },
    reason: { type: String, default: '' },
    date: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.model('RoomRequest', roomRequestSchema);
