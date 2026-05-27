import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    objectId: {
      type: Schema.Types.ObjectId,
      ref: 'objects',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    photos: {
      type: [String],
      default: [],
    },
    total: {
      type: Number,
      required: true,
      min: 1,
    },
    current: {
      type: Number,
      default: 0,
      min: 0,
    },
    progress: {
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

taskSchema.pre('save', function (next) {
  this.progress =
    this.total > 0 ? Math.round((this.current / this.total) * 100) : 0;
  next();
});

export type Task = InferSchemaType<typeof taskSchema>;
export type TaskDocument = HydratedDocument<Task>;

export const TaskCollection = model<Task>('tasks', taskSchema);
