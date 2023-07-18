import React, { useState, useEffect, useMemo } from "react";
import {
  PaymentRequestButtonElement,
  useStripe,
} from "@stripe/react-stripe-js";
import type {
  PaymentRequestTokenEvent,
  PaymentRequest,
} from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { persistStore } from "../../store";
import { useNavigate } from "react-router-dom";

function AppleAndroidBtn(props: { amount: number; clientSecret: string }) {
  const { amount, clientSecret } = props;
  const stripe = useStripe();
  const navigate = useNavigate();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );
  useEffect(() => {
    if (!stripe) return;
    const pr = stripe.paymentRequest({
      country: "FR",
      currency: "eur",
      total: { amount: Math.round(amount * 100), label: "Total" },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Check the availability of the Payment Request API.
    pr.canMakePayment().then((res) => res && setPaymentRequest(pr));

    pr.on("paymentmethod", async (e: PaymentRequestTokenEvent) => {
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: e.paymentMethod.id,
          },
          { handleActions: false }
        );

      if (stripeError) {
        // Show error to your customer (e.g., insufficient funds)
        e.complete("fail");
        stripeError?.message && toast.error(stripeError.message);
        return;
      }

      // There's a risk of the customer closing the window before callback
      // execution. Set up a webhook or plugin to listen for the
      // payment_intent.succeeded event that handles any business critical
      // post-payment actions.
      console.log(paymentIntent);
      if (paymentIntent.status === "requires_action") {
        stripe.confirmCardPayment(clientSecret);
      } else if (paymentIntent.status === "succeeded") {
        e.complete("success");
        persistStore();
        const { status, id } = paymentIntent;
        navigate(
          `/result?redirect_status=${status}&payment_intent=${id}&payment_intent_client_secret=${
            id || clientSecret
          }`
        );
      }
    });
  }, [stripe]);

  const options = useMemo(
    () => (paymentRequest ? { paymentRequest } : null),
    [paymentRequest]
  );

  if (paymentRequest) {
    return <PaymentRequestButtonElement options={options} />;
  }

  // if it is not supported in curtain environment, we need to hide it
  return null;
}

export default AppleAndroidBtn;
