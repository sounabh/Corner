// index.js - Main Server Entry Point
import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./database/db.js";
import authRouter from "./routes/authRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import roomRouter from "./routes/roomRoutes.js"
import cookieParser from "cookie-parser";
import { handleWebhook } from "./controllers/paymentController.js";



// Load environment variables
configDotenv();

// Connect to database
connectDB();

// Create Express application
const app = express();
const PORT = process.env.PORT || 8000;




// CORS Configuration
app.use(cors({
  origin: ['http://localhost:5173','https://corner-liard.vercel.app'],
  credentials:true
  
 
  
}));


// Middleware for parsing cookies and JSON requests
app.use(cookieParser());






// Middleware for parsing JSON requests
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    console.log("a",req.body)
    express.raw({ type: 'application/json' })
     console.log("b",req.body)
    next();
  } else {
    express.json()(req, res, next);
  }
});



// Authentication routes
app.use("/api/auth", authRouter);
app.use("/api/payment",paymentRouter)
app.use("/api/editor",roomRouter)




export { app, PORT }; // Export for socket server usage

