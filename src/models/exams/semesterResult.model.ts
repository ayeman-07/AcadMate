import mongoose, { Schema, Document } from "mongoose";

interface ISemesterResult extends Document {
  student: mongoose.Types.ObjectId;
  semester: number;
  session: string; 
  totalMarks: number; 
  totalCredits: number; 
  sgpa: number;
  grade: string;
}

const SemesterResultSchema = new Schema<ISemesterResult>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    semester: { type: Number, required: true },
    session: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    totalCredits: { type: Number, required: true },
    sgpa: { type: Number, required: true },
    grade: { type: String, required: true }, // Final Grade based on SGPA
  },
  { timestamps: true }
);

// Indexing for fast retrieval based on semester and session
SemesterResultSchema.index({ student: 1, semester: 1, session: 1 });

export default mongoose.model<ISemesterResult>(
  "SemesterResult",
  SemesterResultSchema
);
