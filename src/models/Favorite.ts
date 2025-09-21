// src/models/Favorite.ts

import mongoose, { Schema } from 'mongoose';

const FavoriteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: String, required: true }, // ID from Google Books API
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);