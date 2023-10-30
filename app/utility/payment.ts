import { ShoppingCartModel } from "app/models/CartItemsModel";
import { CreatePaymentSessionInput } from "../models/dto/CreatePaymentSessionInput";
import Stripe from "stripe";

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

export const APPLICATION_FEE = (cartData: ShoppingCartModel) => {
  const appFee = 1.5; // application fee in %
  return (cartData.total / 100) * appFee;
};

export const STRIPE_FEE = (cartData: ShoppingCartModel) => {
  const perTransaction = 2.9; // 2.9 % per transaction
  const fixCost = 0.29; // 29 cents
  const stripeCost = (cartData.total / 100) * perTransaction;
  return stripeCost + fixCost;
};

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export const CreatePaymentSession = async ({
  email,
  phone,
  amount,
  customerId,
}: CreatePaymentSessionInput) => {
  let currentCustomerId: string;

  if (customerId) {
    const customer = await stripe.customers.retrieve(customerId);
    currentCustomerId = customer.id;
  } else {
    const customer = await stripe.customers.create({
      email,
    });
    currentCustomerId = customer.id;
  }

  const { client_secret, id } = await stripe.paymentIntents.create({
    customer: currentCustomerId,
    payment_method_types: ["card"],
    amount: parseInt(`${amount * 100}`), // need to assign as cents
    currency: "usd",
  });

  return {
    secret: client_secret,
    publishableKey: STRIPE_PUBLISHABLE_KEY,
    paymentId: id,
    customerId: currentCustomerId,
  };
};

export const RetrivePayment = async (paymentId: string) => {
  return stripe.paymentIntents.retrieve(paymentId);
};
