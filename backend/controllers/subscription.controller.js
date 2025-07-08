import Subscription from "../models/subscription.model.js";

export const saveSubscription = async (req, res) => {
    
    const subscription = req.body;
    const userId = req.user._id.toString();

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: "Invalid subscription data" });
    }

    // Check if the subscription already exists for the user
    const existingSubscription = await Subscription.findOne({
        endpoint: subscription.endpoint,
        userId: userId,
        "keys.p256dh": subscription.keys.p256dh
      });
      

    if (existingSubscription) {
      return res.status(400).json({ error: "Subscription already exists" });
    }

    const { endpoint, expirationTime, keys } = subscription;
    const newSubscription = new Subscription({
      endpoint,
      expirationTime,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth
      },
      userId: userId
    });


    try {
      await newSubscription.save();
      res.status(201).json({ message: "Subscription saved successfully" });
    } catch (error) {
      console.error("Error saving subscription:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };