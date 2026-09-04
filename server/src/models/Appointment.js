import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    patientId: { type: String, default: '' },
    doctorName: { type: String, default: '' },
    specialty: { type: String, default: '' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    cabin: { type: String, default: '' },
    reason: { type: String, default: '' },
    status: { type: String, default: 'Confirmed' },
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
