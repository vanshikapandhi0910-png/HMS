import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    category: { type: String, default: '' },
    description: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    date: { type: String, default: '' },
    status: { type: String, default: 'Approved' },
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
