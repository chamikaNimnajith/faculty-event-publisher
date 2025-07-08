import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  endpoint:{
    type: String,
    required: true
  },
  expirationTime: {
    type: Date,
    required: false
  },
  keys: {
    p256dh: {
      type: String,
      required: true
    },
    auth: {
      type: String,
      required: true
    }
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});
const Subscription = mongoose.model("Subscription", SubscriptionSchema);
export default Subscription;