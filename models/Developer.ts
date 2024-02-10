import mongoose, { Schema, Document, Model } from "mongoose";

interface DeveloperDoc extends Document {
  name: string;
  phone: string;
  team: string;
  email: string;
  position: string;
  password: string;
  salt: string;
  rating: number;
  tasks: any;
}

const DeveloperSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    team: { type: String, required: true },
    email: { type: String, required: true },
    position: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    rating: { type: Number },
    tasks: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "task",
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Developer = mongoose.model<DeveloperDoc>("Developer", DeveloperSchema);

export { Developer };
