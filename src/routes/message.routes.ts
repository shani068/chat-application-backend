import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { getAllUsersList, getMessages, sendMessage } from "../controllers/message.controller";
// import { accessChat, createGroupChat, fetchChats } from "../controllers/chat.controller";



const router = Router();


router.route("/users").get(verifyJwt, getAllUsersList);
router.route("/messages/:id").get(verifyJwt, getMessages);
router.route("/send/:id").post(verifyJwt, sendMessage);
// router.route("/rename").put(verifyJwt, renameGroup);
// router.route("/groupremove").put(verifyJwt, removeFromGroup);
// router.route("/groupadd").put(verifyJwt, addToGroup);

export default router;