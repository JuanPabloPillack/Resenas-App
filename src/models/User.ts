//src/models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  favorites: [{ bookId: String, addedAt: Date }], // Nuevo formato para favoritos
});

export default mongoose.models.User || mongoose.model('User', userSchema);