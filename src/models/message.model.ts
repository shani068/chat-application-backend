import mongoose, { Schema } from "mongoose";
import { IMessage } from "../interfaces/interfaces";



const messageSchema = new Schema<IMessage>(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

export const Message = mongoose.model<IMessage>("Message", messageSchema);