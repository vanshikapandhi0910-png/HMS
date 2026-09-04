import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    patientId: { type: String, default: '' },
    patientName: { type: String, default: '' },
    doctorName: { type: String, default: '' },
    date: { type: String, default: '' },
    diagnosis: { type: String, default: '' },
    medicines: { type: [{ name: String, dosage: String, duration: String }], default: [] },
    advice: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Prescription', prescriptionSchema);
