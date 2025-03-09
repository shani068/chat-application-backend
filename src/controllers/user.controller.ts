import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { uploadCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";
import { IOptions } from "../interfaces/interfaces";



const Options: IOptions = {
    httpOnly: true,
    secure: true,
}

const generateRefreshAndAccessToken = async (userId:mongoose.Types.ObjectId) =>{
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error while generating access and refresh token");
    }
}

const registerUser = asyncHandler(async (req: Request, res: Response)=>{
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        throw new ApiError(400, "Please provide all the required fields");
    }

    const existingUser = await User.findOne({ email });
    if(existingUser){
        throw new ApiError(409, "User with this email already exists");
    }

    const userPicture = req.file ?  await uploadCloudinary(req.file?.path) : null;
    if(!userPicture){
        throw new ApiError(500, "Error while uploading user picture");
    }

    const user = await User.create({
        name,
        email,
        password,
        picture: userPicture?.url
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(500, "Error while creating user");
    }

    return res.status(201).json(
        new ApiResponse(201, "User created successfully", createdUser)
    )
})

const loginUser = asyncHandler(async (req: Request, res: Response)=>{
    const { email, password } = req.body;

    if(!email || !password){
        throw new ApiError(400, "Please provide all the required fields");
    }

    const user = await User.findOne({ email });
    // console.log("User email", user)
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id);

    const logedInUser = await User.findById(user._id).select("-password -refreshToken");
    if(!logedInUser){
        throw new ApiError(500, "Error while logging in user");
    }

    return res.status(200).cookie("accessToken", accessToken, Options).cookie("refreshToken", refreshToken).json(
        new ApiResponse(200, "User logged in successfully", {
            user: logedInUser, 
            accessToken,
            refreshToken
        })
    )

})

const logoutUser = asyncHandler(async (req: Request, res: Response) =>{
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true,
        }
    )

    return res.status(200).cookie("accessToken", "", Options).cookie("refreshToken", Options).json(
        new ApiResponse(
            200, 
            "User logged out successfully",
            {}
        )
    )
})

const getAllUsers = asyncHandler(async (req: Request, res: Response) =>{
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};

    const users = await User.find(keyword).select("-password -refreshToken").find({_id: { $ne: req.user?._id }});
    if(!users){
        throw new ApiError(404, "No users found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Users fetched successfully", users)
    )
})

export { registerUser, loginUser, logoutUser, getAllUsers };