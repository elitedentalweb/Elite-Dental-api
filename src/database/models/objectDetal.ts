import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

const objectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    priority: {
      type: String,
      enum: ['in_progress', 'priority', 'on_hold'],
      default: 'in_progress',
    },
    photosBefore: {
      type: [String],
      default: [],
    },
    photosAfter: {
      type: [String],
      default: [],
    },
    manualProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export type ObjectType = InferSchemaType<typeof objectSchema>;
export type ObjectDocument = HydratedDocument<ObjectType>;

export const ObjectCollection = model<ObjectType>('objects', objectSchema);
