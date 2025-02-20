// index.js
import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./database/db.js";
import authRouter from "./routes/authRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
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

// Important: Place the webhook route BEFORE CORS middleware and body parsers
// This route needs the raw body for signature verification
app.post(
    '/api/payment/webhook',
    express.raw({ type: 'application/json' }),
    handleWebhook
);

// CORS Configuration - after webhook route
app.use(cors({
    origin: ['http://localhost:5173', 'https://corner-liard.vercel.app'],
    credentials: true
}));

// Regular middleware for all other routes
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/editor", roomRouter);
//app.use("/api/payment", paymentRouter);

export { app, PORT };
