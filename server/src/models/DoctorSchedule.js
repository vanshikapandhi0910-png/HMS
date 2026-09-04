import mongoose from 'mongoose';

const doctorScheduleSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    doctorName: { type: String, default: '' },
    specialty: { type: String, default: '' },
    timings: { type: String, default: '09:00 AM - 02:00 PM (Mon-Sat)' },
    cabin: { type: String, default: '' },
    status: { type: String, default: 'Available for OPD' },
  },
  { timestamps: true }
);

export default mongoose.model('DoctorSchedule', doctorScheduleSchema);
