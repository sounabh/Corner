import Stripe from 'stripe';
import payment from '../models/paymentModel.js';
import User from '../models/userAuthModel.js';

const stripe = new Stripe("sk_test_51QFUdEGwp4u3fMJX68pq4X6drZIGbXTUxNktkV18cWjC6nhFKCwIbiJoYNFSKkric1oRtWAQ0pmMWghXaA6axWs200s79hwsVq");

const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Log incoming webhook details for debugging
        console.log('Webhook Headers:', req.headers);
        console.log('Webhook Signature:', sig);
        
        // Use the raw body we captured earlier
        const payload = req.rawBody;
        
        try {
            event = stripe.webhooks.constructEvent(
                payload,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            console.log('Payload received:', payload);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            // Log the session for debugging
            console.log('Processing checkout session:', session);

            if (!session.customer_details?.email) {
                console.error('No customer email in session:', session.id);
                return res.status(400).json({ error: 'Customer email required' });
            }

            // Find user by email
            const user = await User.findOne({ email: session.customer_details.email });
            if (!user) {
                console.error('User not found:', session.customer_details.email);
                return res.status(404).json({ error: 'User not found' });
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

            // Update user subscription status
            await User.findByIdAndUpdate(
                user._id,
                { 
                    isSubscribed: true,
                    updatedAt: new Date()
                }
            );

            console.log('Payment processed successfully:', {
                paymentId: paymentRecord._id,
                userId: user._id
            });
        }

        // Send success response
        res.json({ received: true });
    } catch (err) {
        console.error('Webhook processing error:', err);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};

export { handleWebhook };
