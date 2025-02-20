import stripe from 'stripe';
import payment from '../models/paymentModel.js';
import User from '../models/userAuthModel.js';

const stripe = new Stripe("sk_test_51QFUdEGwp4u3fMJX68pq4X6drZIGbXTUxNktkV18cWjC6nhFKCwIbiJoYNFSKkric1oRtWAQ0pmMWghXaA6axWs200s79hwsVq");

/**
 * Handles Stripe Webhook events.
 * Processes completed checkout sessions and updates payment and user records.
 */
const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log('Processing completed checkout session:', session.id);

            // Validate session data
            if (!session.customer_details?.email) {
                console.error('Customer email not found in session:', session.id);
                return res.status(400).json({ error: 'Customer email not found' });
            }

            // Find user by email
            const user = await User.findOne({ email: session.customer_details.email });
            if (!user) {
                console.error('User not found:', session.customer_details.email);
                return res.status(404).json({ error: 'User not found' });
            }

            // First try to find existing payment
            let paymentRecord = await payment.findOne({ stripeSessionId: session.id });
            
            if (!paymentRecord) {
                // If no payment record exists, create a new one
                try {
                    paymentRecord = await payment.create({
                        stripeSessionId: session.id,
                        paymentIntentId: session.payment_intent,
                        user: user._id,
                        status: 'completed',
                        customerEmail: session.customer_details.email,
                        updatedAt: new Date(),
                        createdAt: new Date()
                    });
                } catch (error) {
                    console.error('Failed to create new payment record:', error);
                    return res.status(500).json({ error: 'Failed to create payment record' });
                }
            } else {
                // Update existing payment record
                paymentRecord = await payment.findOneAndUpdate(
                    { stripeSessionId: session.id },
                    {
                        paymentIntentId: session.payment_intent,
                        status: 'completed',
                        customerEmail: session.customer_details.email,
                        updatedAt: new Date()
                    },
                    { new: true }
                );
            }

            // Update user subscription status
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { 
                    isSubscribed: true,
                    
                },
                { new: true }
            );

            if (!updatedUser) {
                console.error('Failed to update user subscription status:', user._id);
                return res.status(500).json({ error: 'Failed to update user subscription' });
            }

            console.log('Successfully processed payment and updated user:', {
                paymentId: paymentRecord._id,
                userId: updatedUser._id,
                status: paymentRecord.status
            });
        }

        return res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(400).json({ 
            error: `Webhook Error: ${error.message}`, 
            details: error.stack 
        });
    }
};

export { handleWebhook };
