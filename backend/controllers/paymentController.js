import Stripe from "stripe";
import payment from "../models/paymentModel.js";
import User from "../models/userAuthModel.js";

const stripe = new Stripe(
  "sk_test_51QFUdEGwp4u3fMJX68pq4X6drZIGbXTUxNktkV18cWjC6nhFKCwIbiJoYNFSKkric1oRtWAQ0pmMWghXaA6axWs200s79hwsVq"
);

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const rawbody = req.body.toString()
  console.log("====================================");
  console.log(typeof rawbody);
  console.log("====================================");
  console.log("====================================");
  console.log(rawbody);
  console.log("====================================");


  try {
    const event = stripe.webhooks.constructEvent(
      req.body, // raw body from express.raw()
      sig,
      "whsec_ftcaNVKn30eFSYfuCM4fUAaqs8LCar6m"
    );

    // Log the event type
    console.log("Webhook received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

console.log('====================================');
console.log(session);
console.log('====================================');

      // Validate session data
      if (!session.customer_details?.email) {
        console.error("No customer email in session:", session.id);
        return res.status(400).json({ error: "Customer email required" });
      }

      try {
        // Find user by email
        const user = await User.findOne({
          email: session.customer_details.email,
        });
        if (!user) {
          console.error("User not found:", session.customer_details.email);
          return res.status(404).json({ error: "User not found" });
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
          {
            isSubscribed: true,
          },
          { new: true }
        );

        console.log("Payment processed successfully:", {
          paymentId: paymentRecord._id,
          userId: user._id,
        });
      } catch (error) {
        console.error("Error processing payment:", error);
        return res.status(500).json({ error: "Failed to process payment" });
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
};

export { handleWebhook };
 
