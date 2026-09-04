import mongoose from 'mongoose';

const catalogSchema = new mongoose.Schema(
  {
    kind: { type: String, required: true, index: true }, // doctors | nurses | medicines | machines | visitingDoctors | leaveForms
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

catalogSchema.index({ kind: 1, 'data.id': 1 });

export default mongoose.model('Catalog', catalogSchema);
