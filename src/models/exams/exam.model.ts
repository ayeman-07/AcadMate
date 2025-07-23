import mongoose, { Schema } from "mongoose";

export interface IExam extends mongoose.Document {
  examType: string;
  semester: number;
  departments: string[]; // e.g., ["CSE", "ECE"]
  maxMarks: number;
  startDate: Date;
  endDate: Date;
  duration: number; // in minutes
  subjects: {
    name: string;
    professor: mongoose.Types.ObjectId;
    examDate: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    examType: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    departments: {
      type: [String],
      required: true,
    },
    maxMarks: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true, // in minutes
    },
    subjects: [
      {
        name: {
          type: String,
          required: true,
        },
        professor: {
          type: Schema.Types.ObjectId,
          ref: "Professor",
          required: true,
        },
        examDate: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);
export default Exam;
