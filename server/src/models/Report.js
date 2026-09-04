import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    patientId: { type: String, default: '' },
    patientName: { type: String, default: '' },
    doctorId: { type: String, default: 'DOC-101' },
    doctorName: { type: String, default: 'Dr. Arvind Swamy' },
    testType: { type: String, default: '' },
    department: { type: String, default: 'Pathology Lab' },
    uploadedBy: { type: String, default: '' },
    uploadDate: { type: String, default: '' },
    findings: { type: String, default: '' },
    status: { type: String, default: 'Normal / Clear' },
    downloadUrl: { type: String, default: '#' },
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
