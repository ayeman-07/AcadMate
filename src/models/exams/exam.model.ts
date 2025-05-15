import mongoose, { Schema, Document } from "mongoose";

interface IExam extends Document {
  title: string; 
  subject: string;
  examType: string;
  semester: number;
  department: string;
  maxMarks: number;
  examDate: Date;
  duration: string;
  paperSetter: mongoose.Types.ObjectId; 
}

const ExamSchema = new Schema<IExam>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    examType: { type: String, required: true }, // Example: Quiz 1, Mid Term, End Sem
    semester: { type: Number, required: true },
    department: { type: String, required: true }, // Example: "CSE"
    maxMarks: { type: Number, required: true },
    examDate: { type: Date, required: true },
    duration: { type: String, required: true },
  },
  { timestamps: true }
);

// **Indexing for optimized filtering by Exam Type, Semester, and Date**
ExamSchema.index({ examType: 1, semester: 1, examDate: 1 });

export default mongoose.model<IExam>("Exam", ExamSchema);
