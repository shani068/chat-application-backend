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
exports.getAllUsers = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const user_model_1 = require("../models/user.model");
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const cloudinary_1 = require("../utils/cloudinary");
const ApiResponse_1 = require("../utils/ApiResponse");
const Options = {
    httpOnly: true,
    secure: true,
};
const generateRefreshAndAccessToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        yield user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, "Error while generating access and refresh token");
    }
});
const registerUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new ApiError_1.ApiError(400, "Please provide all the required fields");
    }
    const existingUser = yield user_model_1.User.findOne({ email });
    if (existingUser) {
        throw new ApiError_1.ApiError(409, "User with this email already exists");
    }
    const userPicture = req.file ? yield (0, cloudinary_1.uploadCloudinary)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) : null;
    if (!userPicture) {
        throw new ApiError_1.ApiError(500, "Error while uploading user picture");
    }
    const user = yield user_model_1.User.create({
        name,
        email,
        password,
        picture: userPicture === null || userPicture === void 0 ? void 0 : userPicture.url
    });
    const createdUser = yield user_model_1.User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError_1.ApiError(500, "Error while creating user");
    }
    return res.status(201).json(new ApiResponse_1.ApiResponse(201, "User created successfully", createdUser));
}));
exports.registerUser = registerUser;
const loginUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError_1.ApiError(400, "Please provide all the required fields");
    }
    const user = yield user_model_1.User.findOne({ email });
    // console.log("User email", user)
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    const isPasswordMatched = yield user.comparePassword(password);
    if (!isPasswordMatched) {
        throw new ApiError_1.ApiError(401, "Invalid user credentials");
    }
    const { accessToken, refreshToken } = yield generateRefreshAndAccessToken(user._id);
    const logedInUser = yield user_model_1.User.findById(user._id).select("-password -refreshToken");
    if (!logedInUser) {
        throw new ApiError_1.ApiError(500, "Error while logging in user");
    }
    return res.status(200).cookie("accessToken", accessToken, Options).cookie("refreshToken", refreshToken).json(new ApiResponse_1.ApiResponse(200, "User logged in successfully", {
        user: logedInUser,
        accessToken,
        refreshToken
    }));
}));
exports.loginUser = loginUser;
const logoutUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield user_model_1.User.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, {
        $set: {
            refreshToken: undefined
        }
    }, {
        new: true,
    });
    return res.status(200).cookie("accessToken", "", Options).cookie("refreshToken", Options).json(new ApiResponse_1.ApiResponse(200, "User logged out successfully", {}));
}));
exports.logoutUser = logoutUser;
const getAllUsers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};
    const users = yield user_model_1.User.find(keyword).select("-password -refreshToken").find({ _id: { $ne: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id } });
    if (!users) {
        throw new ApiError_1.ApiError(404, "No users found");
    }
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, "Users fetched successfully", users));
}));
exports.getAllUsers = getAllUsers;
