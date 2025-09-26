import Doubts from "../models/doubts.model.js";

export async function addDoubt(req, res) {
    const studentId = req.id;
    const {courseId} = req.params;
    const {question} = req.body;

    if (!studentId || !courseId || !question) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const updatedDoubtDoc = await Doubts.findOneAndUpdate(
            { studentId, courseId },
            { $push: { doubts: { question, answers: [] } } },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: "Doubt added successfully", data: updatedDoubtDoc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
