import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv"


configDotenv()

export const generateVerificationToken = () => {
  return  Math.floor(100000 + Math.random() * 900000).toString()
}

export const generateJwtTokenandSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	return token;
};