import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

const inviteSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export type Invite = InferSchemaType<typeof inviteSchema>;
export type InviteDocument = HydratedDocument<Invite>;

export const InviteCollection = model<Invite>('invites', inviteSchema);
