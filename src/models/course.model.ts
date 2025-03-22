import { Schema, model, models, Document, Types } from "mongoose";

export interface ICourse extends Document {
  name: string;
  code: string;
  description: string;
  teacher: Types.ObjectId;
  students: Types.ObjectId[];
  semester: number;
  department: string;
  credits: number;
  syllabus: string;
  isActive: boolean;
}

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Course code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher is required"],
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 8,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    credits: {
      type: Number,
      required: [true, "Credits are required"],
      min: 1,
    },
    syllabus: {
      type: String,
      required: [true, "Syllabus is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
courseSchema.index({ code: 1 }, { unique: true });
courseSchema.index({ department: 1, semester: 1 });
courseSchema.index({ teacher: 1 });

const Course = models.Course || model<ICourse>("Course", courseSchema);

export default Course;
