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
import { useMemo, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import AppleAndroidBtn from "./AppleAndroidBtn";
import cls from "classnames";
import styles from "./index.module.scss";

function PaymentPage() {
  const { total, stripeInfo, summary, fee, amtAfterFee, tip, subTotal, rounded } = useSelector(
    (state: RootState) => {
      const { summary, fee, amtAfterFee, tip, rounded } =
        state[ORDERING_FEATURE_KEY];
      return {
        total: getTotalAmount(summary, tip),
        rounded,
        amtAfterFee,
        summary,
        fee,
        stripeInfo: state[STRIPE_FEATURE_KEY],
        tip: tip.selected ? tip.amount : 0,
        subTotal: getTotalAmount(summary)
      };
    }
  );

  const contactFormRef = useRef<any>(null);
  const checkContactValidity = () => contactFormRef.current?.checkValidity();
  useGetStripeInfoQuery({ total, rounded }, {
    skip: stripeInfo.initialized,
  });

  const { clientSecret, publicKey } = stripeInfo;
  const stripe = useMemo(() => publicKey && loadStripe(publicKey), [publicKey]);

  return (
    <div className={cls("page-wrapper", styles.pageWrapper)}>
      <LogoHeader />
      <ExpasionOrder summary={summary} />
      <ContactForm ref={(el) => (contactFormRef.current = el)} />
      {clientSecret && publicKey && (
        <Elements stripe={stripe || null} options={{ clientSecret }}>
          <AppleAndroidBtn amount={amtAfterFee} clientSecret={clientSecret} />
          <CheckoutForm
            amount={amtAfterFee}
            subTotal={subTotal}
            checkValidity={checkContactValidity}
            fee={fee}
            tip={tip}
          />
        </Elements>
      )}
    </div>
  );
}

export default PaymentPage;
