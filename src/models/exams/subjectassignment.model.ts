// models/SubjectAssignment.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface ISubjectAssignment extends Document {
  batchCode: string;
  currSem: number;
  subjects: mongoose.Types.ObjectId[];
  totalCredits: number;
}

const SubjectAssignmentSchema = new Schema<ISubjectAssignment>(
  {
    batchCode: { type: String, required: true, uppercase: true },
    currSem: { type: Number, required: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject", required: true }],
    totalCredits: { type: Number, required: true },
  },
  { timestamps: true }
);

SubjectAssignmentSchema.index({ batchCode: 1, currSem: 1 }, { unique: true });

export default models.SubjectAssignment || mongoose.model<ISubjectAssignment>(
  "SubjectAssignment",
  SubjectAssignmentSchema
);