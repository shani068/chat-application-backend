import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";


interface decodedToken extends JwtPayload{
    _id: string;
}


export const verifyJwt = asyncHandler(async (req: Request, res: Response, next: NextFunction) =>{
    const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");
    // const token = req.headers.authorization?.split(" ")[1] || "";
    try {
        if(!token){
            throw new ApiError(401, "Unauthorized request");
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "") as decodedToken;
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, (error as Error)?.message || "Invalid access token");
    }
})