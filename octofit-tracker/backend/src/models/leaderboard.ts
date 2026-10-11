import { model, Schema } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    points: { type: Number, required: true, min: 0, default: 0 },
    activityCount: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

export default model('Leaderboard', leaderboardSchema);
