import { model, Schema } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export default model('Team', teamSchema);
