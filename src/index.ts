import dotenv from "dotenv";
import { app } from "./app";
import { Server } from "socket.io";
import { createServer } from "node:http";
import connectDB from "./db/dbConfig";
import { connectSocket } from "./utils/socket";


dotenv.config();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    }
});

connectSocket(io);
// io.on("connection", (socket) =>{
//     console.log("A user connected");
//     console.log("Socket ID: ", socket.id);
//     socket.on("disconnect", () =>{
//         console.log("A user disconnected");
//     })

//     socket.emit("message", `Welcome to chat app ${socket.id}`);
// })

// server.listen(process.env.PORT, () =>{
//     console.log(`Server is running on port ${process.env.PORT}`);
// })

connectDB().then(()=>{
    server.listen(process.env.PORT, () =>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })

    app.on("error", (error)=>{
        console.log("Express Server error !!", error);
    })
}).catch((error)=>{
    console.log("MongoDB connection Failed !!!", error);
})