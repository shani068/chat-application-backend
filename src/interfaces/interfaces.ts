import { Types } from "mongoose";



export interface IChat{
    chatName: string;
    isGroupChat: boolean;
    users: Types.ObjectId[];
    latestMessage: Types.ObjectId;
    groupAdmin: Types.ObjectId;
}

export interface IMessage{
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    text: string;
    image: string;
}

export interface IUser{
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    picture: string;
    refreshToken: string;
}
export interface IOptions{
    httpOnly: boolean;
    secure: boolean;
}