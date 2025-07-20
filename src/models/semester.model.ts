import mongoose from "mongoose";

export interface ISemester extends mongoose.Document {
  name: string;
  department: string;
}

const semesterSchema = new mongoose.Schema<ISemester>({
  name: { type: String, required: true },
  department: { type: String, required: true },
}, { timestamps: false, versionKey: false });

export default mongoose.models.Semester || mongoose.model<ISemester>("Semester", semesterSchema);