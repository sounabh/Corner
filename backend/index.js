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

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://corner-liard.vercel.app'],
  credentials: true
}));

// Handle Stripe webhook route first, before any other middleware
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), handleWebhook );

// Regular middleware for all other routes
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/editor", roomRouter);

// Handle all other payment routes after body parsing
//app.use("/api/payment", paymentRouter);

export { app, PORT };
