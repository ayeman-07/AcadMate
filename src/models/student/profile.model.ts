import mongoose, { Schema, Document } from "mongoose";

interface IProfile extends Document {
  student: mongoose.Types.ObjectId;
  gender: "male" | "female" | "other";
  dateOfBirth: Date;
  fatherName: string;
  motherName: string;
  fatherMobile: string;
  motherMobile: string;
  studentMobile: string;
  address: string;
  nationality: string;
  category: "General" | "OBC" | "SC" | "ST" | "EWS";
  tenthMarksheetUrl: string; 
  twelfthMarksheetUrl: string; 
  jeeMainRank?: number;
  diplomaCertificateUrl?: string; 
  semester: number;
  department: string;
}

const ProfileSchema = new Schema<IProfile>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dateOfBirth: { type: Date, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    fatherMobile: { type: String, required: true },
    motherMobile: { type: String, required: true },
    studentMobile: { type: String, required: true },
    address: { type: String, required: true },
    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST", "EWS"],
      required: true,
    },
    tenthMarksheetUrl: { type: String, required: true },
    twelfthMarksheetUrl: { type: String, required: true },
    jeeMainRank: { type: Number },
    diplomaCertificateUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>("Profile", ProfileSchema);
