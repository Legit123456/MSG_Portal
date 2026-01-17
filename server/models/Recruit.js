import mongoose from 'mongoose';

const recruitSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  faculty: { type: String, required: true },
  level: { type: String, enum: ['100', '200', '300', '400', '500'], required: true },
  course: { type: String, required: true },
  whatsapp: { type: String, required: true },
  reason: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  passportUrl: { type: String, required: true },
  signatureUrl: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  appliedAt: { type: Date, default: Date.now }
});

// THIS is the key fix: use export default
export default mongoose.model('Recruit', recruitSchema);