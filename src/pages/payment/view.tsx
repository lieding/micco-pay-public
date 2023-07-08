import LogoHeader from "../../components/logoHeader";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutForm";
import { useGetStripeInfoQuery } from "../../store/api";
import { useSelector } from "react-redux";
import { ORDERING_FEATURE_KEY, getTotalAmount } from "../../store/ordering";
import { STRIPE_FEATURE_KEY } from "../../store/stripe";
import { RootState } from "../../store";
import ExpasionOrder from "../../components/expansionOrder";
import ContactForm from "./contactForm";
import { useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";

function PaymentPage() {
  const { total, stripeInfo, summary } = useSelector((state: RootState) => {
    const { summary, tip, rounded } = state[ORDERING_FEATURE_KEY];
    return {
      total: getTotalAmount(summary, tip, rounded),
      summary,
      stripeInfo: state[STRIPE_FEATURE_KEY],
    };
  });

  const contactFormRef = useRef<any>(null);
  const checkContactValidity = () => contactFormRef.current?.checkValidity();
  useGetStripeInfoQuery(total, {
    skip: stripeInfo.initialized,
  });

  const { clientSecret, publicKey } = stripeInfo;

  return (
    <div className="page-wrapper">
      <LogoHeader />
      <ExpasionOrder summary={summary} />
      <ContactForm ref={(el) => (contactFormRef.current = el)} />
      {clientSecret && publicKey && (
        <Elements stripe={loadStripe(publicKey)} options={{ clientSecret }}>
          <CheckoutForm amount={total} checkValidity={checkContactValidity} />
        </Elements>
      )}
    </div>
  );
}

export default PaymentPage;
