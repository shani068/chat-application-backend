import type { Server } from "socket.io";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";


export const connectSocket = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    io.on("connection", (socket)=>{
        console.log("A user connected", socket.id);

        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
        })
    })

    // io.on("disconnect", (socket)=>{
    //     console.log("A user disconnected", socket.id);
    // })
}