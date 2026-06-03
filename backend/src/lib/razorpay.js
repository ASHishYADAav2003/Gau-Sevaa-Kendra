import Razorpay from "razorpay";
import { env } from "../config/env.js";

let client = null;

export const getRazorpayClient = () => {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    throw new Error("Razorpay credentials are not configured.");
  }

  if (!client) {
    client = new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret
    });
  }

  return client;
};
