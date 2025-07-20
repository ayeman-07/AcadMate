import mongoose, { Schema, Document, models } from "mongoose";

interface IResult extends Document {
  student: mongoose.Types.ObjectId;
  exam: string;
  subject: string;
  marksObtained: number;
  sem: string;
  batchCode: string; 
}

const ResultSchema = new Schema<IResult>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    exam: { type: String, required: true },
    subject: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    sem: { type: String, required: true}, 
    batchCode: { type: String, required: true }, 
  },
  { timestamps: true }
);

export default models.Result || mongoose.model<IResult>("Result", ResultSchema);
