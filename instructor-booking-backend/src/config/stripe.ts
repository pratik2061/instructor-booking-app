import Stripe from "stripe";
import { env } from "./environment.js";

const stripe: Stripe = new Stripe(env.STRIPE_SECRET_KEY);

export default stripe;