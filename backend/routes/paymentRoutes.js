import express from "express"
import { createCheckoutSession, handleWebhook } from "../controllers/paymentController.js";


const router = express.Router()

router.post('/create-checkout', createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
//router.get('/status/:sessionId', getPaymentStatus);



export default router