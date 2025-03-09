"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocket = void 0;
const connectSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected", socket.id);
        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
        });
    });
    // io.on("disconnect", (socket)=>{
    //     console.log("A user disconnected", socket.id);
    // })
};
exports.connectSocket = connectSocket;
