import mongoose, { Schema, Document } from "mongoose";

interface ISubject extends Document {
  name: string;
  code: string; 
  credits: number;
  isElective: boolean;
  isPractical: boolean;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credits: { type: Number, required: true },
    isElective: { type: Boolean, default: false },
    isPractical: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ISubject>("Subject", SubjectSchema);