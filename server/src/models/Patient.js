import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, default: 0 },
    gender: { type: String, default: 'Male' },
    room: { type: String, default: 'General Ward - Assigned' },
    doctorAssigned: { type: String, default: '' },
    condition: { type: String, default: 'Under Observation' },
    status: { type: String, enum: ['Admitted', 'Critical Care', 'OPD Patient', 'Discharged'], default: 'Admitted' },
  },
  { timestamps: true }
);

export default mongoose.model('Patient', patientSchema);
