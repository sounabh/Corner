// index.js
import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDB from './database/db.js';
import authRouter from './routes/authRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import cookieParser from 'cookie-parser';
import { handleWebhook } from './controllers/paymentController.js';

configDotenv();
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// Render-specific raw body parser middleware
const renderWebhookMiddleware = express.raw({
    type: 'application/json',
    verify: (req, res, buf) => {
        if (req.originalUrl.startsWith('/api/payment/webhook')) {
            req.rawBody = buf.toString('utf8');
        }
    }
});

// Apply raw body parsing only to webhook route
app.post('/api/payment/webhook', renderWebhookMiddleware, handleWebhook);

// CORS configuration - after webhook route
app.use(cors({
    origin: ['http://localhost:5173', 'https://corner-liard.vercel.app'],
    credentials: true
}));

// Standard middleware for other routes
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/editor', roomRouter);
app.use('/api/payment', paymentRouter);

export { app, PORT };
