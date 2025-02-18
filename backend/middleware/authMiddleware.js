import jwt from "jsonwebtoken"
import User from "../models/userAuthModel.js";

const authMiddleware = async (req, res, next) => {

   // console.log("hhawuhy");
    
  try {
    // Get token from cookies
    let token;

    // ✅ 1️⃣ First, try getting the token from cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // ✅ 2️⃣ If not found in cookies, check Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1]; // Extract token after "Bearer "
    }
    

    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add userId to request object
   // req.userId = decoded.userId;
   const user = await User.findById(decoded.userId)
   req.user = user
    
    // Proceed to next middleware/route handler
    next();
    
  } catch (error) {
    // Handle invalid/expired token
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

export default authMiddleware