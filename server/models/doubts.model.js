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

// Post hook to call n8n after a new doubt is added
doubtsSchema.post('findOneAndUpdate', async function(doc) {
    if (!doc) return;

    const lastDoubt = doc.doubts[doc.doubts.length - 1];

    try {
        await axios.post('https://ashutoshkhedkar.app.n8n.cloud/webhook-test/ef952197-8e4b-4f5c-941e-4462e466f3ba', {
            studentId: doc.studentId,
            courseId: doc.courseId,
            question: lastDoubt.question,
            doubtId: doc._id
        });
    } catch (error) {
        console.error("Failed to notify n8n:", error.message);
    }
});

const Doubts = mongoose.model("Doubt", doubtsSchema);

export default Doubts;
