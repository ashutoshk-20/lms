import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createCourse, createLecture, editCourse, editCoursePublish, editLecture, getCourseById, getCourseDetail, getCourseLecture, getCreatorCourses, getLectureById, getPublishedCourses, removeCourse, removeLecture } from "../controllers/course.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route('/').post(isAuthenticated, createCourse);
router.route('/').get(isAuthenticated, getCreatorCourses);
router.route('/:courseId').put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);
router.route("/:courseId/publish").put(isAuthenticated, editCoursePublish);
router.route('/courses/published').get(getPublishedCourses);
router.route("/:courseId").delete(isAuthenticated, removeCourse);
router.route("/course-detail/:courseId").get(getCourseDetail);

export default router;