import Stripe from "stripe";

const stripeKey = process.env.STRIPE_KEY!;

const stripe = new Stripe(stripeKey, {
  apiVersion: "2020-08-27",
});

export { stripe };
