import Course from "../models/course.model.js";
import Enrolled from "../models/enrolledCourses.model.js";
import User from "../models/user.model.js";


export const enrollCourse = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let enrollment = await Enrolled.findOne({ userId, courseId });

        if (enrollment) {
            if (enrollment.status === "inprogress" || enrollment.status === "completed") {
                return res.status(400).json({ message: "Already enrolled in this course" });
            } else {
                enrollment.status = "inprogress";
                await enrollment.save();
            }
        } else {
            enrollment = await Enrolled.create({
                userId,
                courseId,
                status: "inprogress"
            });
        }

        if (!user.enrolledCourses.includes(courseId)) {
            user.enrolledCourses.push(courseId);
            await user.save();
        }

        if (!course.enrolledStudents.includes(userId)) {
            course.enrolledStudents.push(userId);
            await course.save();
        }

        return res.status(200).json({
            message: "Course enrollment successful",
            enrollment,
        });
    } catch (error) {
        console.log("error in enrolling", error);

        return res.status(500).json({ message: "Server error" });
    }
}

export const getCourseEnrollStatus = async(req,res) =>{
    try{
        const {courseId, userId} = req.params;
        
        if(!userId){
            return res.status(200).json({
                status:"unenrolled"
            })
        }

        const enrollment = await Enrolled.findOne({courseId,userId});

        if(!enrollment){
            return res.status(200).json({
                status:"unenrolled"
            })
        }

        return res.status(200).json({
            status: enrollment.status,
        })
    }catch(error){
        return res.status(500).json({ 
            status:error,
            message: "Server error" 
        });
    }
}
