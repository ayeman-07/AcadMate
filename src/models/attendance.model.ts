import { Schema, model, models, Document, Types } from "mongoose";

export interface IAttendance extends Document {
  course: Types.ObjectId;
  student: Types.ObjectId;
  date: Date;
  status: "present" | "absent" | "pc";
  markedBy: Types.ObjectId;
  remarks?: string;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["present", "absent", "pc"],
      required: [true, "Status is required"],
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Marker is required"],
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ course: 1, student: 1, date: 1 }, { unique: true });
attendanceSchema.index({ course: 1, date: 1 });
attendanceSchema.index({ student: 1, date: 1 });

const Attendance =
  models.Attendance || model<IAttendance>("Attendance", attendanceSchema);

export default Attendance;
