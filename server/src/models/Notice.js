import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    postedBy: { type: String, default: 'Admin' },
    date: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Notice', noticeSchema);
