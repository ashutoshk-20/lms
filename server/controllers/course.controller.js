import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = async (req, res) =>{
    try {
        const {courseTitle, category} = req.body;
        if(!courseTitle || !category){
            return res.status(400).json({message: "All fields are required"});
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        });

        return res.status(201).json({
            success: true,
            course,
            message: "Course created successfully"

        })

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const getCreatorCourses = async (req,res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({creator:userId})

        if(!courses){
            return res.status(404).json({
                courses:[],
                message:"Courses not found"
            })
        }

        return res.status(201).json({
            courses,
            message:"All courses found"
        })

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const editCourse = async(req,res) => {
    try{
        const courseId = req.params.courseId;
        const {courseTitle, subTitle, description, category, courseLevel} = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }

        let courseThumbnail;
        if(thumbnail){
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId);
            }

            const cloudResponse = await uploadMedia(thumbnail.path);
            courseThumbnail = cloudResponse?.secure_url;
        }

        const updateData = {
            courseTitle,
            subTitle,
            description,
            category,
            courseLevel,
            courseThumbnail
        }

        course = await Course.findByIdAndUpdate(courseId, updateData, {new:true});

        return res.status(200).json({
            course,
            message:"Course updated succcessfully"
        })

    } catch(error) {
        return res.status(500).json({message: error.message});
    }
}

export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        const course = await Course.findById(courseId);

        if(!course) return res.status(404).json({
            message: "Course not found"
        })

        return res.status(200).json({
            course,
            message: "Course Found"
        })

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const createLecture = async(req,res) =>{
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId) return res.status(400).json({
            message: "Lecture title is required"
        });

        const lecture = await Lecture.create({lectureTitle});

        const course = await Course.findById(courseId);

        if(course){
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            message:"Lecture Created Successfully"
        })


    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId).populate("lectures");
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }

        return res.status(200).json({
            lectures: course.lectures
        })

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const editLecture = async (req,res) => {
    try {
        const {lectureTitle, videoInfo, isPreview }= req.body;
        const {courseId, lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture) {
            return res.status(404).json({
                message:"Lecture not found"
            })
        }

        if(lectureTitle) lecture.lectureTitle = lectureTitle;
        if(videoInfo.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if(videoInfo.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreview = isPreview;

        await lecture.save();

        // Ensure the course still has the lecture id if it was not already added
        const course = await Course.findById(courseId);
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(200).json({
            lecture,
            message:"Lecture updated successfully"
        })

    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

export const removeLecture = async(req,res) =>{
    try {
        const {lectureId} = req.params;
        console.log(lectureId);
        
        const lecture = await Lecture.findByIdAndDelete(lectureId);

        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found"
            })
        }

        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        const course = await Course.findOne({ lectures: lectureId });
        if (!course) {
            return res.status(404).json({
                message: "Course not found for this lecture"
            });
        }

        // Remove the lecture reference from the course
        course.lectures.pull(lectureId);

        // If no lectures remain, unpublish the course
        if (course.lectures.length === 0) {
            course.isPublished = false;
        }

        await course.save();
        

        res.status(200).json({
            message:"Lecture deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const getLectureById = async(req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);

        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found"
            });
        }

        res.status(200).json({
            lecture
        });

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const editCoursePublish = async(req,res) =>{
    try{
        const {courseId} = req.params;
        const {isPublished} = req.body;

        const course = await Course.findById(courseId);

        if(!course){
            return res.send(404).json({
                message:"Course not found"
            })
        }

        const updatedCourse = await Course.findByIdAndUpdate(courseId,{isPublished},{new:true});

        return res.status(200).json({
            updatedCourse,
            message:"Course Published"
        })
    } catch(error){
        return res.status(500).json({message: error.message});
    }
}

export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate({path:"creator", select:"name imgUrl"});

        if(!courses){
            return res.status(404).json({
                message:"Courses not found"
            })
        }

        return res.status(200).json({
            courses,
            message: "Found all published courses"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // Delete all lectures associated with the course
        if (course.lectures && course.lectures.length > 0) {
            for (const lectureId of course.lectures) {
                const lecture = await Lecture.findByIdAndDelete(lectureId);

                // If the lecture has a video in cloudinary, delete it
                if (lecture?.publicId) {
                    await deleteVideoFromCloudinary(lecture.publicId);
                }
            }
        }

        // Finally delete the course itself
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            message: "Course and associated lectures deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getCourseDetail = async (req,res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate({path:"creator", select:"name"}).populate({path:"lectures"});
    
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }

        return res.status(200).json({
            course,
            message: "Course fetched"
        });
    
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}