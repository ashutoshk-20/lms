import Course from "../models/course.model.js";
import Doubts from "../models/doubts.model.js";
import axios from "axios";
import mongoose from "mongoose";
import striptags from "striptags"
import "dotenv/config"

export async function addDoubt(req, res) {
    const studentId = req.id;
    const { courseId } = req.params;
    const { question } = req.body;

    if (!studentId || !courseId || !question) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // 1. Fetch course info
        const course = await Course.findById(courseId).select("courseTitle description courseLevel category");
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // 2. Append doubt to doubts array
        const updatedDoubtDoc = await Doubts.findOneAndUpdate(
            { studentId, courseId },
            { $push: { doubts: { question, answers: [] } } },
            { new: true, upsert: true }
        );

        // 3. Send question + course context to n8n webhook
        const response = await axios.post(process.env.N8N_TEST_URL, {
            studentId,
            courseId,
            question,
            courseTitle: course.courseTitle,
            courseDescription: striptags(course.description),
            courseLevel: course.courseLevel,
            courseCategory: course.category
        });
       
        const aiAnswer = response?.data?.output;

        // 6. If an AI answer is found, append it to the latest doubt
        if (aiAnswer) {
            const lastDoubt = updatedDoubtDoc.doubts[updatedDoubtDoc.doubts.length - 1];
            await Doubts.updateOne(
                { _id: updatedDoubtDoc._id, "doubts._id": lastDoubt._id },
                { $push: { "doubts.$.answers": aiAnswer } }
            );
        }

        res.status(200).json({ message: "Doubt added successfully", data: updatedDoubtDoc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export async function getDoubts(req, res) {
  const studentId = req.id; // assuming auth middleware sets this
  const { courseId } = req.params;
    
  if (!studentId || !courseId) {
    return res.status(400).json({ message: "Student ID and Course ID are required" });
  }

  try {
    // Find doubts for this student + course
    const doubtsDoc = await Doubts.findOne({ studentId, courseId })
      .populate("studentId", "name email") // optional: student details
      .populate("courseId", "title description level category"); // optional: course details

    if (!doubtsDoc) {
      return res.status(404).json({ message: "No doubts found for this course" });
    }

    res.status(200).json({
      message: "Doubts fetched successfully",
      doubts: doubtsDoc.doubts, // just return the doubts array for UI
      course: doubtsDoc.courseId, // so UI knows course context
    });
  } catch (error) {
    console.error("Error fetching doubts:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
