"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const socket_io_1 = require("socket.io");
const node_http_1 = require("node:http");
const dbConfig_1 = __importDefault(require("./db/dbConfig"));
const socket_1 = require("./utils/socket");
dotenv_1.default.config();
const server = (0, node_http_1.createServer)(app_1.app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    }
});
(0, socket_1.connectSocket)(io);
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
(0, dbConfig_1.default)().then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
    app_1.app.on("error", (error) => {
        console.log("Express Server error !!", error);
    });
}).catch((error) => {
    console.log("MongoDB connection Failed !!!", error);
});
