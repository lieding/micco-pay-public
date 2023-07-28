import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import styles from "./index.module.scss";
import cls from "classnames";
import { persistStore } from "../../store";

export default function CheckoutForm(props: {
  amount: number;
  fee: number;
  checkValidity: () => boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !props.checkValidity()) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    // before the page redirecting, we need to to persisit the data
    persistStore();

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/result`,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message ?? "erreur inconnue");
      }
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsProcessing(false);
  };

  const { amount, fee } = props;

  const subTotal = (amount - fee).toFixed(2);

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className={styles.checkoutForm}
    >
      <PaymentElement id="payment-element" />
      <div className={cls(styles.total)}>
        <div className={cls("flex-between")}>
          <div>Sous-total:</div>
          <div>{subTotal}€</div>
        </div>
        <div className={cls("flex-between")}>
          <div>Frais:</div>
          <div>{fee}€</div>
        </div>
        <div className={cls(styles.last, "flex-between")}>
          <div>Total:</div>
          <div>{amount}€</div>
        </div>
      </div>
      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        className={styles.paymentBtn}
      >
        <span id="button-text">
          {isProcessing ? "Attentions ... " : "Payer"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && (
        <div className={styles.message} id="payment-message">
          {message}
        </div>
      )}
    </form>
  );
}
