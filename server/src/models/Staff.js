import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    dept: { type: String, default: '' },
    salary: { type: Number, default: 0 },
    status: { type: String, enum: ['Present', 'Absent', 'On Leave'], default: 'Present' },
  },
  { timestamps: true }
);

export default mongoose.model('Staff', staffSchema);
