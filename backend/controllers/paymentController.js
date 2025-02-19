import Stripe from 'stripe';
import payment from '../models/paymentModel.js';
import User from '../models/userAuthModel.js';

const stripe = new Stripe("sk_test_51QFUdEGwp4u3fMJX68pq4X6drZIGbXTUxNktkV18cWjC6nhFKCwIbiJoYNFSKkric1oRtWAQ0pmMWghXaA6axWs200s79hwsVq");

/**
 * Creates a Stripe Checkout Session and saves an initial payment record.
 */
const createCheckoutSession = async (req, res) => {
    try {
        const { amount, userId } = req.body;
        console.log('Creating checkout session:', { amount, userId });

        if (!amount || !userId) {
            return res.status(400).json({ error: 'Amount and userId are required' });
        }

        // Validate user existence
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          customer_email: user.email,
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: { name: 'Purchase' },
                    unit_amount: amount * 100, // Convert to cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `https://corner-liard.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://corner-liard.vercel.app/cancel`,
        });

        // Save initial payment record
        const newPayment = await payment.create({
            stripeSessionId: session.id,
            user: user._id,
            status: 'pending',
        });

        console.log('Payment session created:', session.id);
        res.json({ sessionId: session.id, payment: newPayment });
    } catch (error) {
        console.error('Checkout session creation failed:', error);
        res.status(500).json({ error: 'Payment session creation failed', details: error.message });
    }
};

/**
 * Handles Stripe Webhook events.
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


 if (!session.customer_details || !session.customer_details.email) {
                console.error('Customer email not found in session:', session.id);
                return res.status(400).json({ error: 'Customer email not found' });
            }

            // Find user by email
            const user = await User.findOne({ email: session.customer_details.email });
            if (!user) {
                console.error('User not found:', session.customer_details.email);
                return res.status(404).json({ error: 'User not found' });
            }
            


            
            // Find payment record
            const updatedPayment = await payment.findOneAndUpdate(
                { user: user._id },
                {
                    status: 'completed',
                    paymentIntentId: session.payment_intent,
                    customerEmail: session.customer_details.email,
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!updatedPayment) {
                console.error('Payment record not found:', session.id);
                return res.status(404).json({ error: 'Payment record not found' });
            }

             const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { 
                    isSubscribed: true,
                    
                },
                { new: true }
            );

           
        }

        return res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).json({ error: `Webhook Error: ${error.message}`, details: error.stack });
    }
};

export { createCheckoutSession, handleWebhook };
