

import Stripe from 'stripe';
import payment from '../models/paymentModel.js';
import User from '../models/userAuthModel.js';

const stripe = new Stripe("sk_test_51QFUdEGwp4u3fMJX68pq4X6drZIGbXTUxNktkV18cWjC6nhFKCwIbiJoYNFSKkric1oRtWAQ0pmMWghXaA6axWs200s79hwsVq");


const  createCheckoutSession = async(req,res) => {


    const {amount,productId} = req.body
    console.log(amount,productId);
    
    // Create Stripe checkout session
    try {
        const { amount, productId } = req.body;
    
        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: 'Corner Purchase',
                },
                unit_amount:amount*100 , // Convert to cents
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `https://corner.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
          
        });
    
        // Save initial payment record to database
       const Payment =  await payment.create({
          stripeSessionId: session.id,
          amount,
          productId,
          status: 'pending',
        });
    
      

        res.json({ Payment });
      } catch (error) {
        console.error('Checkout session creation failed:', error);
        res.status(500).json({ error: 'Payment session creation failed' });
      }
    };
    

const  handleWebhook = async (req, res) => {

        const sig = req.headers['stripe-signature'];
        let event;
      
        try {
          // Verify webhook signature
          event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
          );
      
          // Handle successful payment
          if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
      
      console.log(session);
      const user = await User.findOne({email:session.customer_details.email})
      
            // Update payment record in database
         const Payment =    await payment.create({
              stripeSessionId: session.id ,
              user:user._id,
                status: 'completed',
                paymentIntentId: session.payment_intent,
                customerEmail: session.customer_details.email,
                updatedAt: new Date()
              }
            );
          }
      


          await User.findByIdAndUpdate(User._id, { isSubscribed: true });
         
       
          
   
     
          

      

        return  res.json({ received: true });
        } catch (error) {
          console.error('Webhook error:', error);
          res.status(400).send(`Webhook Error: ${error.message}`);
        }
      };




export {createCheckoutSession,handleWebhook}
