import mongoose, { Schema, Document, Model } from "mongoose";

interface TaskDoc extends Document {
  developerId: string;
  devName: string;
  taskName: string;
  team: string;
  description: string;
  category: string;
  finishedTime: number;
  points: number;
}

const TaskSchema = new Schema(
  {
    developerId: { type: String },
    devName: { type: String },
    taskName: { type: String, required: true },
    team: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    finishedTime: { type: Number, required: true },
    points: { type: Number },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Task = mongoose.model<TaskDoc>("task", TaskSchema);
export { Task };
