import express from 'express'
import isAuthenticated from '../middleware/isAuthenticated.js'
import { getCourseProgress, markAsCompleted, markAsInCompleted, updateLectureProgress } from '../controllers/courseProgress.controller.js'
// import { addDoubt, getDoubts } from '../controllers/doubts.controller.js';

const router = express.Router()

router.route("/:courseId").get(isAuthenticated, getCourseProgress);
router.route("/:courseId/lecture/:lectureId/view").post(isAuthenticated, updateLectureProgress);
router.route("/:courseId/complete").post(isAuthenticated,markAsCompleted);
router.route("/:courseId/incomplete").post(isAuthenticated,markAsInCompleted);
// router.route("/:courseId/doubt").post(isAuthenticated,addDoubt);
// router.route("/:courseId/doubts").get(isAuthenticated, getDoubts);

export default router;