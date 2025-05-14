import { Schema, model, Document, Types } from "mongoose";

export interface ITeachingAssignment extends Document {
  professor: Types.ObjectId; 
  subject: Types.ObjectId; 
  batchCode: string; 
  semester: number; 
  year: string; 
}

const TeachingAssignmentSchema = new Schema<ITeachingAssignment>(
  {
    professor: {
      type: Schema.Types.ObjectId,
      ref: "Professor",
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    batchCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    year: {
      type: String,
      required: true, 
    },
  },
  { timestamps: true }
);
TeachingAssignmentSchema.index(
  { professor: 1, subject: 1, batchCode: 1, semester: 1, year: 1 },
  { unique: true }
);

export default model<ITeachingAssignment>(
  "TeachingAssignment",
  TeachingAssignmentSchema
);
