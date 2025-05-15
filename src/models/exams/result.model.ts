import mongoose, { Schema, Document } from "mongoose";

interface IResult extends Document {
  student: mongoose.Types.ObjectId;
  exam: string;
  subject: mongoose.Types.ObjectId;
  marksObtained: number;
  evaluator: mongoose.Types.ObjectId; 
}

const ResultSchema = new Schema<IResult>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    exam: { type: String, required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    marksObtained: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IResult>("Result", ResultSchema);
