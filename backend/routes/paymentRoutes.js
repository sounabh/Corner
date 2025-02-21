import express from "express"
import { handleWebhook } from "../controllers/paymentController.js";


const router = express.Router()


router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
//router.get('/status/:sessionId', getPaymentStatus);



export default router
