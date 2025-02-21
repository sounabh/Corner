import Stripe from "stripe";
import payment from "../models/paymentModel.js";
import User from "../models/userAuthModel.js";

const stripe = new Stripe("sk_test_51QFUdEGwp4u3fMJX68pq4X6drZIGbXTUxNktkV18cWjC6nhFKCwIbiJoYNFSKkric1oRtWAQ0pmMWghXaA6axWs200s79hwsVq");

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  console.log(req.body)
  
  try {
    let event;
    
    try {
      // Verify the event. req.body should already be raw buffer from middleware
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        "whsec_ftcaNVKn30eFSYfuCM4fUAaqs8LCar6m"
      );
    } catch (err) {
      console.error(`⚠️  Webhook signature verification failed:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log(session)
        
        try {
          // Validate session data
          if (!session.customer_details?.email) {
            throw new Error('No customer email in session');
          }

          // Find user by email
          const user = await User.findOne({
            email: session.customer_details.email,
          });
          
          if (!user) {
            throw new Error(`User not found: ${session.customer_details.email}`);
          }

          // Create payment record
          const paymentRecord = await payment.create({
            stripeSessionId: session.id,
            paymentIntentId: session.payment_intent,
            user: user._id,
            status: "completed",
            customerEmail: session.customer_details.email,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          // Update user subscription status
          await User.findByIdAndUpdate(
            user._id,
            { isSubscribed: true },
            { new: true }
          );

          console.log(`✅ Payment processed successfully for user: ${user._id}`);
        } catch (error) {
          console.error('❌ Error processing checkout session:', error);
          // Don't return error response here - we still want to return 200 to Stripe
          // Just log the error and continue
        }
        break;
        
      default:
        // Unexpected event type
        console.log(`⚠️  Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
    
  } catch (err) {
    console.error('❌ Webhook handler error:', err);
    res.status(500).send(`Webhook Error: ${err.message}`);
  }
};

export { handleWebhook };
