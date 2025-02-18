import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  stripeSessionId: {
    type: String,
    required: true,
    unique: true
  },
  paymentIntentId: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  customerEmail: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


const payment = mongoose.model("Payment", paymentSchema);
export default payment;
