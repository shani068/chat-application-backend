// import mongoose, { Schema } from "mongoose";
// import { IChat } from "../interfaces/interfaces";


// const chatSchema = new Schema<IChat>(
//     {
//         chatName: {
//             type: String,
//             trim: true,
//         }, 
//         isGroupChat: {
//             type: Boolean,
//             default: false,
//         },
//         users: [
//             {
//                 type: Schema.Types.ObjectId,
//                 ref: "User",
//             }
//         ],
//         latestMessage: {
//             type: Schema.Types.ObjectId,
//             ref: "Message",
//         },
//         groupAdmin: {
//             type: Schema.Types.ObjectId,
//             ref: "User",
//         }
//     },
//     {
//         timestamps: true,
//     }
// )

// export const Chat = mongoose.model<IChat>("Chat", chatSchema);