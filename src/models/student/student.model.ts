import { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type Branch = "CSE" | "ECE";
export type Section = "1" | "2";

export interface IStudent extends Document {
  name: string;
  roll: string;
  password: string;
  branch: Branch;
  section: Section;
  semester: number;
  dob: Date;
  avatar?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  isActive: boolean;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IStudentMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const studentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    roll: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
      enum: ["CSE", "ECE"],
    },
    section: {
      type: String,
      required: [true, "Section is required"],
      enum: ["1", "2"],
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 8,
    },
    dob: {
      type: Schema.Types.Date,
      required: [true, "Date of birth is required"],
      transform: function (value: any) {
        if (!value) return;
        return value
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "-");
      },
    },
    avatar: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
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
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Hash password before saving
studentSchema.pre("save", async function (this: IStudent, next) {
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
studentSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};


const Student = models.Student || model<IStudent>("Student", studentSchema);

export default Student;
