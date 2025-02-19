// index.js - Main Server Entry Point
import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./database/db.js";
import authRouter from "./routes/authRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import roomRouter from "./routes/roomRoutes.js"
import cookieParser from "cookie-parser";



// Load environment variables
configDotenv();

// Connect to database
connectDB();

// Create Express application
const app = express();
const PORT = process.env.PORT || 8000;



app.use(cookieParser())
// CORS Configuration
app.use(cors({
  origin: 'https://corner-liard.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'] // Add this line
}));

// Middleware for parsing JSON requests
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
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

