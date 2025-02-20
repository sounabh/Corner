import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./database/db.js";
import authRouter from "./routes/authRoutes.js";

import roomRouter from "./routes/roomRoutes.js";
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
  origin: ['http://localhost:5173', 'https://corner-liard.vercel.app'],
  credentials: true
}));

// Webhook handler must come before any body parsing middleware
app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

// Regular middleware for other routes
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/editor", roomRouter);


// Export for testing/startup
export { app, PORT };
