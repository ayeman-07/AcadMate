import { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface ISubjectAllotment {
  subjectName: string;
  branch: string;
  section: string;
}

export interface IProfessor extends Document {
  name: string;
  email: string;
  password: string;
  department?: string;
  designation?: string;
  avatar?: string;
  phoneNumber?: string;
  subjectAllotment?: ISubjectAllotment[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const subjectAllotmentSchema = new Schema<ISubjectAllotment>(
  {
    subjectName: { type: String, required: true },
    branch: { type: String, required: true },
    section: { type: String, required: true },
  },
  { _id: false } // avoids Mongoose creating an _id for this nested object
);

const professorSchema = new Schema<IProfessor>(
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
      enum: ["CSE", "ECE"],
    },
    designation: {
      type: String,
    },
    avatar: {
      type: String,
      default: "",
    },
    phoneNumber: String,
    subjectAllotment: {
      type: [subjectAllotmentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
professorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Failed to hash password"));
    }
  }
});

// Compare password method
professorSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to compare passwords");
  }
};

const Professor =
  models.Professor || model<IProfessor>("Professor", professorSchema);

export default Professor;
