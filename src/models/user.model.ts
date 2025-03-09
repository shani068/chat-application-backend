import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "../interfaces/interfaces";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";


interface IUserMethods{
    comparePassword(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true, 
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 10,
        },
        picture: {
            type: String,
            default: "https://img.freepik.com/premium-photo/anime-male-avatar_950633-956.jpg",
        },
        refreshToken: {
            type: String,
            default: null,
        }
    },
    { timestamps: true }
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    if(!process.env.ACCESS_TOKEN_SECRET){
        throw new ApiError(500, "Access token secret is not set");
    }

    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

userSchema.methods.generateRefreshToken = function(){

    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET ? process.env.REFRESH_TOKEN_SECRET : "",
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model<IUser, UserModel>("User", userSchema);