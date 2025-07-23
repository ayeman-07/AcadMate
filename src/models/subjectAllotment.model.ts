import mongoose from "mongoose";

interface ISubjectAllotment extends mongoose.Document {  
    batchCode: string;
    subjectName: string;
}
 
const subjectAllotmentSchema = new mongoose.Schema<ISubjectAllotment>({
    batchCode: {
        type: String,
        required: true,
    },
    subjectName: {
        type: String,
        required: true,
    },
}, { timestamps: false, versionKey: false });

export default mongoose.models.SubjectAllotment ||
    mongoose.model<ISubjectAllotment>("SubjectAllotment", subjectAllotmentSchema);