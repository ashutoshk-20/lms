import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });

    }catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({message: 'Server error'});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        generateToken(res, user);

        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.name}`,
            user
        });

    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

export const logout = async (_,res) => {
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            success:true,
            message: "Logged out successfully"
        })
    } catch (error) {
        console.error('Error during logging out:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

export const getUserProfile = async (req,res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if(!user) {
            return res.status(404).json({
                success:false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error. Failed to load user'
        });
    }
}

export const updateProfile = async (req,res) => {
    try {
        const userId = req.id;
        const {name,role} = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success:false
            })
        }

        //extract public id of old image from the url if exist

        if(user.imgUrl){
            const publicId = user.imgUrl.split("/").pop().split(".")[0];
            deleteMediaFromCloudinary(publicId);
        }

        //upload new photo
        const cloudResponse = await uploadMedia(profilePhoto.path);
        const imgUrl = cloudResponse.secure_url; 

        const updatedData = {name, imgUrl, role}

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");
        return res.status(200).json({
            success: true,
            user:updatedUser,
            message: "Profile Updated Successfully"
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error. Failed to update user'
        });
    }
}
