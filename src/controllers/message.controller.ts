import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Message } from "../models/message.model";
import { uploadCloudinary } from "../utils/cloudinary";
import { ApiError } from "../utils/ApiError";



const getAllUsersList = asyncHandler(async (req: Request, res: Response)=>{
    const loggedInUser = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password -refreshToken");
    if(!filteredUsers){
        throw new ApiError(404, "No users found");
    }

    return res.status(200).json(
        new ApiResponse(200, "All Users fetched successfully", filteredUsers)
    )
})

const getMessages = asyncHandler(async (req: Request, res: Response)=>{
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
        $or: [
            { senderId: senderId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: senderId }
        ]
    })

    return res.status(200).json(
        new ApiResponse(200, "Messages fetched successfully", messages)
    )
})

const sendMessage = asyncHandler(async (req: Request, res: Response)=>{
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;
    if(image){
        const imageUploaded = await uploadCloudinary(image);
        if(!imageUploaded){
            throw new ApiError(500, "Error while uploading image");
        }
        imageUrl = imageUploaded.url;
    }

    const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image: imageUrl
    })

    await newMessage.save();

    return res.status(201).json(
        new ApiResponse(201, "Message created successfully", newMessage)
    )
})
export { getAllUsersList, getMessages, sendMessage }