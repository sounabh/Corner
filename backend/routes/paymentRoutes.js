import express from "express";
import { handleWebhook } from "../controllers/paymentController.js";

const router = express.Router();

// Note: We don't need express.raw here anymore as it's handled in main app
router.post('/webhook', handleWebhook);

export default router;
