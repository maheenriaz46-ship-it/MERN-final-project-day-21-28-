import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    location: { type: String, trim: true, default: '' },
    type: { type: String, enum: ['Job', 'Internship'], default: 'Internship' },
    status: { type: String, enum: ['Applied', 'Interview', 'Rejected', 'Offer'], default: 'Applied' },
    appliedDate: { type: Date, default: Date.now },
    link: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
