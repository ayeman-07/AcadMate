import mongoose from "mongoose";

export interface Attendance {
  studentId: mongoose.Schema.Types.ObjectId;
  subjectName: string;
  professor: mongoose.Schema.Types.ObjectId;
  subjectCode: string;
  date: Date;
  isPresent: boolean;
  sem: number;
}

const attendanceSchema = new mongoose.Schema<Attendance>(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    subjectName: { type: String, required: true },
    professor: { type: mongoose.Schema.Types.ObjectId, required: true },
    subjectCode: { type: String, required: true },
    date: { type: Date, required: true },
    isPresent: { type: Boolean, required: true },
    sem: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Attendance ||
  mongoose.model<Attendance>("Attendance", attendanceSchema);
