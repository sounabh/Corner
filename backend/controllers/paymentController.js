import Stripe from 'stripe';
import payment from '../models/paymentModel.js';
import User from '../models/userAuthModel.js';

const stripe = new Stripe("sk_test_51QFUdEGwp4u3fMJX68pq4X6drZIGbXTUxNktkV18cWjC6nhFKCwIbiJoYNFSKkric1oRtWAQ0pmMWghXaA6axWs200s79hwsVq");

const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const rawBody = req.body; // Already in raw Buffer format from express.raw()

    if (!sig) {
        console.error("❌ Missing Stripe signature header");
        return res.status(400).json({ error: "Missing signature" });
    }

    try {
        const event = stripe.webhooks.constructEvent(
            rawBody, // Pass the raw Buffer directly
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        console.log("✅ Webhook verified! Event type:", event.type);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            if (!session?.customer_details?.email) {
                console.error('❌ Missing customer email in session:', session.id);
                return res.status(400).json({ error: 'Customer email required' });
            }

            try {
                const user = await User.findOne({ email: session.customer_details.email });
                if (!user) {
                    console.error('❌ User not found:', session.customer_details.email);
                    return res.status(404).json({ error: 'User not found' });
                }

                const paymentRecord = await payment.create({
                    stripeSessionId: session.id,
                    paymentIntentId: session.payment_intent,
                    user: user._id,
                    status: 'completed',
                    customerEmail: session.customer_details.email,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                await User.findByIdAndUpdate(
                    user._id,
                    { isSubscribed: true },
                    { new: true }
                );

                console.log('✅ Subscription updated for user:', user._id);
            } catch (error) {
                console.error('❌ Database error:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

        res.status(200).json({ received: true });
    } catch (err) {
        console.error("❌ Webhook verification failed:", err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
};

export { handleWebhook };
