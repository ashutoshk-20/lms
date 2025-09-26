import mongoose from "mongoose"

const enrolledSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },

    status: {
        type: String,
        enum: ["unenrolled", "inprogress", "completed"],
        default: "unenrolled"
    },
},{timestamps:true});

const Enrolled = mongoose.model("Enrolled",enrolledSchema);
export default Enrolled;