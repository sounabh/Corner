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

app.use(cookieParser());

// CORS Configuration
const corsOptions = {
  origin: ['https://corner-liard.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Origin', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions));

// Middleware for parsing JSON requests
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/editor", roomRouter);

// Add a middleware to set CORS headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://corner-liard.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, Origin, Accept');
  next();
});

export { app, PORT };
