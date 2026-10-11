import { model, Schema } from 'mongoose';

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    activityType: {
      type: String,
      required: true,
      enum: ['running', 'walking', 'cycling', 'swimming', 'strength', 'other'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
  },
  { timestamps: true },
);

export default model('Workout', workoutSchema);
