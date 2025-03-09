import { Router } from "express";
import { getAllUsers, loginUser, logoutUser, registerUser } from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJwt } from "../middlewares/auth.middleware";




const router = Router();

router.route("/register").post(upload.single("picture"), registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/users").get(verifyJwt, getAllUsers)


export default router;