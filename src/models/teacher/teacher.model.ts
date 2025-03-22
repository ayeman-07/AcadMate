import { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface ITeacher extends Document {
  name: string;
  email: string;
  password: string;
  department: string;
  designation: string;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  isActive: boolean;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const teacherSchema = new Schema<ITeacher>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: ["CSE", "ECE"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    phoneNumber: String,
    address: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
teacherSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};


const Teacher = models.Teacher || model<ITeacher>("Teacher", teacherSchema);

export default Teacher;
