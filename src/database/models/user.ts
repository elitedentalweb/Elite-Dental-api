import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    nickname: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'worker'],
      default: 'user',
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

userSchema.methods.toJSON = function (this: UserDocument) {
  const { password, resetToken, resetTokenExpiry, ...rest } = this.toObject();
  return rest;
};

export const UserCollection = model<User>('users', userSchema);
