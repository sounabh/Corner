import User from "../models/userAuthModel.js";
import bcryptjs from "bcryptjs";
import {
  generateJwtTokenandSetCookie,
  generateVerificationToken,
} from "../utils/genVerificationCode.js";
//import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js";





const signUp = async (req, res) => {
  const { name, email, password } = req.body

//  console.log('====================================');
 //console.log(name,email,password);
  //console.log('====================================');

  try {
    if ((!name, !email, !password)) {
      throw new Error("All values are required");
    }

    const userAlreadyExist = await User.findOne({ email });

    if (userAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "User is already registered" });
    }
    

    const hashedPassword = await bcryptjs.hash(password, 10);

    const verificationToken = generateVerificationToken();

    const user = new User({
      name,
      password: hashedPassword,
      email,
      verificationToken,
      verifyTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();
    generateJwtTokenandSetCookie(res, user._id);
    //await sendVerificationEmail(user.email,verificationToken)

    res.status(201).json({
      success: true,
      message: "User created Successfully",
      user: {
        ...user._doc,
        password: null,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};



const verifyEmailViaCode = async(req,res)=>{

const {code} = req.body

try {
  
const user = await User.findOne({
  verificationToken:code,
  verifyTokenExpiresAt:{$gt:Date.now()}
})


if(!user){
  return res.status(400).json({success:false,message:"Invalid or expired validation code"})
}

user.isVerified = true
user.verificationToken = undefined
user.verifyTokenExpiresAt = undefined

await user.save()
//await sendWelcomeEmail(user.email,user.name)

return res.status(200).json({success:true,message:"User Verified succesfully"})

} catch (error) {
  return res.status(500).json({ success: false, error: error });
}


}


const login = async(req,res) => {
  const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);

		if (!isPasswordValid && user.isVerified) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		 const token = generateJwtTokenandSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				id:user._id,
        name:user.name,
				password: undefined,
        token
			}
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
}


const ResetPassword = async (req,res) => {


  const { newPassword, confirmPassword} = req.body;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const user = await User.findOne({email:req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
//console.log(user);

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

export {signUp,verifyEmailViaCode,login,ResetPassword}