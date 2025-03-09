"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = exports.getAllUsersList = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const user_model_1 = require("../models/user.model");
const ApiResponse_1 = require("../utils/ApiResponse");
const message_model_1 = require("../models/message.model");
const cloudinary_1 = require("../utils/cloudinary");
const ApiError_1 = require("../utils/ApiError");
const getAllUsersList = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUser = req.user._id;
    const filteredUsers = yield user_model_1.User.find({ _id: { $ne: loggedInUser } }).select("-password -refreshToken");
    if (!filteredUsers) {
        throw new ApiError_1.ApiError(404, "No users found");
    }
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, "All Users fetched successfully", filteredUsers));
}));
exports.getAllUsersList = getAllUsersList;
const getMessages = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const messages = yield message_model_1.Message.find({
        $or: [
            { senderId: senderId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: senderId }
        ]
    });
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, "Messages fetched successfully", messages));
}));
exports.getMessages = getMessages;
const sendMessage = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl = null;
    if (image) {
        const imageUploaded = yield (0, cloudinary_1.uploadCloudinary)(image);
        if (!imageUploaded) {
            throw new ApiError_1.ApiError(500, "Error while uploading image");
        }
        imageUrl = imageUploaded.url;
    }
    const newMessage = yield message_model_1.Message.create({
        senderId,
        receiverId,
        text,
        image: imageUrl
    });
    yield newMessage.save();
    return res.status(201).json(new ApiResponse_1.ApiResponse(201, "Message created successfully", newMessage));
}));
exports.sendMessage = sendMessage;
