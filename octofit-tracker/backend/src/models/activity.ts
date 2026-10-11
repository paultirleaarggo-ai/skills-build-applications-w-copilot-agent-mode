import { model, Schema } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      required: true,
      enum: ['running', 'walking', 'cycling', 'swimming', 'strength', 'other'],
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    points: { type: Number, required: true, min: 0, default: 0 },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

export default model('Activity', activitySchema);
