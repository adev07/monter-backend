import express from "express"
const router = express.Router()

// import controllers
import {addUser, VerifyOtp, loginUser, completeProfile, dashboard, updateProfile} from "../controllers/userController.js"

router.route("/register").post(addUser)
router.route("/verify-otp").post(VerifyOtp)
router.route("/login").post(loginUser)
router.route("/profile-completion").post(completeProfile)
router.route("/update-profile").put(updateProfile)
router.route("/dashboard").get(dashboard)


export default router;