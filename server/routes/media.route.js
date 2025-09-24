import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async(req, res) => {
    try {
        const result = await uploadMedia(req.file.path);
        res.status(200).json({
            message:"File Uploaded successfully",
            data:result,
            succes:true
        })
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
})

export default router;