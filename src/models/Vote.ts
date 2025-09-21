// src/models/Vote.ts

import mongoose, { Schema } from 'mongoose';

const VoteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reviewId: { type: Schema.Types.ObjectId, ref: 'Review', required: true },
  value: { type: Number, required: true, enum: [1, -1] }, // Upvote (1) or Downvote (-1)
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Vote || mongoose.model('Vote', VoteSchema);