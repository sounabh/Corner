import express from "express"
import { login, ResetPassword, signUp,verifyEmailViaCode } from "../controllers/authController.js"
import authMiddleware from "../middleware/authMiddleware.js"


const router = express.Router()


router.route("/signup").post(signUp)

router.route("/login").post(login)

router.route("/logout").get((req,res)=>{
    res.send("logout router")
})


router.route("/verify-email").post(verifyEmailViaCode)

router.route("/reset-password").post(authMiddleware,ResetPassword)


export default router