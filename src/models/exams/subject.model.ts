import mongoose, { Schema, Document } from "mongoose";

interface ISubject extends Document {
  name: string;
  code: string; // Example: "CS101"
  credits: number;
  session: string; // Example: "2024-25"
  semester: number;
  department: string; // Example: "CSE", "ECE", "Open Elective"
  isElective: boolean;
  professor: mongoose.Types.ObjectId; // Subject Coordinator/Professor
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credits: { type: Number, required: true },
    session: { type: String, required: true },
    semester: { type: Number, required: true },
    department: { type: String, required: true }, // Example: CSE, ECE, Open Elective
    isElective: { type: Boolean, default: false },
    professor: {
      type: Schema.Types.ObjectId,
      ref: "Professor",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexing for faster lookups based on department, semester, and session
SubjectSchema.index({ department: 1, semester: 1, session: 1 });

export default mongoose.model<ISubject>("Subject", SubjectSchema);