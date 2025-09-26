import Course from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgresss.model.js";

export const getCourseProgress = async (req,res) => {
    try {
        // Fetch courrse info
        const {courseId} = req.params;
        const userId = req.id;

        let courseProgress = await CourseProgress.findOne({courseId, userId}).populate("courseId");

        const courseDetails = await Course.findById(courseId).populate("lectures");

        if(!courseDetails){
            return res.status(404).json({
                message:"Course not found"
            })
        }

        // If no progress return course details with empty progress

        if(!courseProgress){
            return res.status(200).json({
                data:{
                    courseDetails,
                    progress:[],
                    completed: false
                }
            })
        }

        // Return the user's course progress along with course details
        return res.status(200).json({
            data:{
                courseDetails,
                progress:courseProgress.lectureProgress,
                completed: courseProgress.completed
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:error
        })
    }
}

export const updateLectureProgress = async (req,res) => {
    try {
        const {courseId, lectureId} = req.params;
        const userId = req.id;

        //fetch or create course progress
        let courseProgress = await CourseProgress.findOne({courseId,userId});
        
        if(!courseProgress){
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed:false,
                lectureProgress:[],
            })
        }

        // Find the lecture progress in the courseProgress

        const lectureIndex = courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId === lectureId);

        if(lectureIndex !== -1){
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        }else{
            courseProgress.lectureProgress.push({lectureId, viewed:true})
        }

        // if all lecture completed
        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg) => lectureProg.viewed).length;

        const course = await Course.findById(courseId);

        if(course.lectures.length === lectureProgressLength){
            courseProgress.completed = true;
        }

        await courseProgress.save();

        return res.status(200).json({
            message:"Lecture Progress updated successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:error
        })
    }
};

export const markAsCompleted = async (req,res) => {
    try {
        const {courseId} = req.params;
        const userId = req.id

        const courseProgress = await CourseProgress.findOne({courseId, userId});
        if(!courseProgress){
            return res.status(404).json({
                message:"Course progress not found"
            })
        }

        courseProgress.lectureProgress.map((lectureProg) => lectureProg.viewed = true);
        courseProgress.completed = true;

        await courseProgress.save();

        return res.status(200).json({
            message:"Course marked as completed"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:error
        })
    }
}

export const markAsInCompleted = async (req,res) => {
    try {
        const {courseId} = req.params;
        const userId = req.id

        const courseProgress = await CourseProgress.findOne({courseId, userId});
        if(!courseProgress){
            return res.status(404).json({
                message:"Course progress not found"
            })
        }

        courseProgress.lectureProgress.map((lectureProg) => lectureProg.viewed = false);
        courseProgress.completed = false;

        await courseProgress.save();

        return res.status(200).json({
            message:"Course marked as incompleted"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:error
        })
    }
}

