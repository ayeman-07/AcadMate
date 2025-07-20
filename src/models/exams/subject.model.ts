import mongoose, { Schema, Document, models } from "mongoose";

interface ISubject extends Document {
  name: string;
  code: string;
  credits: number;
  isPractical: boolean;
  dept: string; // CSE, ECE, etc.
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credits: { type: Number, required: true },
    isPractical: { type: Boolean, default: false },
    dept: {
      type: String,
      required: true,
      enum: ["CSE", "ECE"], // Add more departments as needed
    },
  },
  { timestamps: true }
);

export default models.Subject ||
  mongoose.model<ISubject>("Subject", SubjectSchema);