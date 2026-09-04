import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    submittedBy: { type: String, default: '' },
    role: { type: String, default: 'Patient' },
    category: { type: String, default: '' },
    subject: { type: String, default: '' },
    detail: { type: String, default: '' },
    date: { type: String, default: '' },
    status: { type: String, enum: ['Resolved', 'Pending Review', 'In Progress'], default: 'Pending Review' },
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', complaintSchema);
