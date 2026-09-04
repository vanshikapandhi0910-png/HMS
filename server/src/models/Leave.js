import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    applicantName: { type: String, default: '' },
    role: { type: String, default: '' },
    dept: { type: String, default: '' },
    leaveDates: { type: String, default: '' },
    reason: { type: String, default: '' },
    status: { type: String, default: 'Pending Approval' },
  },
  { timestamps: true }
);

export default mongoose.model('Leave', leaveSchema);
