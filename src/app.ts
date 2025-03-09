import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();


app.use(cors({
    origin: "*",
    credentials: true,
}))
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());


import authRoutes from "./routes/user.routes";
import messageRoutes from "./routes/message.routes";

app.use("/api/user", authRoutes);
app.use("/api/chat", messageRoutes);

export { app };