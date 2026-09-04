import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Receptionist', 'Nurse', 'Doctor', 'Patient'], required: true },
    passwordHash: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
