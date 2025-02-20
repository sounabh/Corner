// paymentController.js
import Stripe from 'stripe';
import payment from '../models/paymentModel.js';
import User from '../models/userAuthModel.js';

const stripe = new Stripe("sk_test_51QFUdEGwp4u3fMJX68pq4X6drZIGbXTUxNktkV18cWjC6nhFKCwIbiJoYNFSKkric1oRtWAQ0pmMWghXaA6axWs200s79hwsVq");

const handleWebhook = async (req, res) => {
    // For Render deployment, the raw body is available at req.rawBody
    const payload = req.rawBody;
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
        console.error("❌ Missing Stripe signature header");
        return res.status(400).json({ error: "Missing Stripe signature" });
    }

    try {
        console.log("Attempting webhook verification...");
        console.log("Signature received:", sig);
        
        const event = stripe.webhooks.constructEvent(
            payload,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        console.log("✅ Webhook verified! Event type:", event.type);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            console.log("Processing checkout session:", session.id);

            if (!session.customer_details?.email) {
                throw new Error('No customer email in session');
            }

            // Find user and process payment
            const user = await User.findOne({ 
                email: session.customer_details.email 
            }).exec();

            if (!user) {
                throw new Error(`User not found: ${session.customer_details.email}`);
            }

            // Create payment record
            const paymentRecord = await payment.create({
                stripeSessionId: session.id,
                paymentIntentId: session.payment_intent,
                user: user._id,
                status: 'completed',
                customerEmail: session.customer_details.email,
                
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Update user subscription
            await User.findByIdAndUpdate(
                user._id,
                { 
                    isSubscribed: true,
                },
                { new: true }
            );

            console.log('✅ Payment processed successfully:', {
                paymentId: paymentRecord._id,
                userId: user._id,
                email: user.email
            });
        }

        // Send response
        return res.json({ received: true });

    } catch (err) {
        console.error("❌ Webhook Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

export { handleWebhook };
