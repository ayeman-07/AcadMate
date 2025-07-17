import mongoose from "mongoose";

export interface ISemester extends mongoose.Document {
  name: string;
}

const semesterSchema = new mongoose.Schema<ISemester>({
  name: { type: String, required: true },
});

export const Semester = mongoose.model<ISemester>("Semester", semesterSchema);