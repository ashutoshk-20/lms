import mongoose from 'mongoose';
import axios from 'axios';

const doubtsSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    doubts: [
        {
            question: { type: String, required: true },
            answers: [{ type: String }],
            askedAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });


const Doubts = mongoose.model("Doubt", doubtsSchema);

export default Doubts;
