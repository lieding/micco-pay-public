import Expasion from "../../components/expansionOrder";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  ORDERING_FEATURE_KEY,
  getTotalAmount,
  setRounded,
  checkWithoutPayment,
  checkNeedContactInfo,
  getDisabledPaymentMethodKeys,
} from "../../store/ordering";
import styles from "./index.module.scss";
import CustomInput from "../../components/customInput";
import LogoHeader from "../../components/logoHeader";
import cls from "classnames";
import Tipping from "./tipping";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PAYGREEN_FEATURE_KEY, resetPaygreenInfo } from "../../store/paygreen";
import { useScrollTop } from "../../hooks";
import SubTotalAndFee from "../../components/subTotalAndFee";
import floatingTotalBtnBarStyles from "../../components/floatingTotalBtnBar/index.module.scss";
import floatingBtnBarStyles from "../../components/floatingBar/floatingBar.module.scss";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";
import ContactFormPopup from "../../components/contactForm";
import PaymentMethosSelect from "./paymentMethodSelect";
import { persistStore } from "../../store";
import { Paygreen, simpleDeepEqual } from "../../utils";
import { Contact } from "../../typing";

function BtnRow(props: { total: number; beforeLeave: () => boolean | void }) {
  const eles = (
    <div
      className={cls(floatingBtnBarStyles.container, styles.right)}
      onClick={props.beforeLeave}
    >
      Confirmer
    </div>
  );

  return (
    <div
      className={cls(
        floatingBtnBarStyles.wrapper,
        floatingTotalBtnBarStyles.wrapper,
        styles.btnWrapper
      )}
    >
      <div className={floatingTotalBtnBarStyles.totalAmount}>
        <div>Total:</div>
        <div>{props.total.toFixed(2)}€</div>
      </div>
      <div className={styles.btnRow}>{eles}</div>
    </div>
  );
}

function PromoCode() {
  return (
    <>
      <div className={cls(styles.promoTitle, styles.title)}>
        Vous avez un code promo?
      </div>
      <CustomInput placeholder="Promo code" />
    </>
  );
}

function selector(state: RootState) {
  const { paymentMethodKey } = state[ORDERING_FEATURE_KEY];
  const withoutPayment = checkWithoutPayment(paymentMethodKey);
  const needContactInfo = checkNeedContactInfo(paymentMethodKey);
  return {
    orderInfo: state[ORDERING_FEATURE_KEY],
    paygreenInited: state[PAYGREEN_FEATURE_KEY].initialized,
    feeConfig: state[RESTAURANT_FEATURE_KEY].feeConfig,
    withoutPayment,
    needContactInfo,
  };
}

function ConfirmPage() {
  const {
    orderInfo: {
      summary,
      tip,
      rounded,
      contact,
      paymentConfigs,
      paymentMethodKey
    },
    paygreenInited,
    feeConfig,
    withoutPayment,
    needContactInfo,
  } = useSelector(selector);

  useScrollTop();

  const dispatch = useDispatch();
  const [popupVisible, togglePopupVisible] = useState(false);
  const prevTotalRef = useRef<{ amount: number; contact: Contact } | null>(
    null
  );
  const total = getTotalAmount(summary, tip, rounded);
  const subTotal = getTotalAmount(summary);

  useEffect(() => {
    Paygreen.importResources();
    if (!paygreenInited) return;
    prevTotalRef.current = {
      amount: getTotalAmount(summary, tip, rounded),
      contact: contact,
    };
  }, []);

  const contactFormRef = useRef<any>(null);
  const checkContactValidity = () => contactFormRef.current?.checkValidity();

  const navigate = useNavigate();
  const initialPaymentMethod = useRef(paymentMethodKey);
  const disabledPaymentMethodKeys =
    useMemo(() => getDisabledPaymentMethodKeys(paymentConfigs), [paymentConfigs]);

  // the callback function is going to be executed when it is going to leave
  // the objective is that when the user has started payment process but stopped and went back
  // in such screnrio, we need to reset the paygreen data and make the paylebt start from scratch
  // if 'true' is returned, it would stop the redirecting logic
  // if 'false/void' is returned, it would continue
  const beforeLeave = () => {
    if (needContactInfo) {
      if (!checkContactValidity()) {
        togglePopupVisible(true);
        return true;
      }
    }
    // if 'prevTotalRef.current' is null, it says it is in the first time loaded, it should continue
    if (prevTotalRef.current) {
      // the programme runs here, it says the user has already tried the payment process but returned back,
      // Before, we need to check if the amount and 'contact' configuration has changed, if the changes detected, we need to reset the paygreen configuration
      // But now, considering the valid payment session is too short (10 mins), we need to reset the payment configs, that is if users
      // returned to the previous page and they wanted to go gorward to the payment page, we need to reset the whole session
      const current = { amount: total, contact };
      // if (!simpleDeepEqual(current, prevTotalRef.current))
      dispatch(resetPaygreenInfo());
    }
    if (withoutPayment) {
      persistStore();
      navigate("/result");
    } else setTimeout(() => navigate("/payment"), 50);
  };

  const subPlusTip = subTotal + (tip.selected ? tip.amount : 0);

  // We need to re-calculate the fee every time the total price changes
  const fee = withoutPayment
    ? 0
    : feeConfig
    ? total * feeConfig.percentage + feeConfig.addition
    : 0;

  return (
    <>
      <div className={cls("flex-column", "page-wrapper", styles.pageWrapper)}>
        <LogoHeader />
        <div className={styles.content}>
          <Expasion summary={summary} />
          <PromoCode />
          <Tipping tip={tip} rounded={rounded} subPlusTip={subPlusTip} />
          <PaymentMethosSelect
            configs={paymentConfigs}
            initialPaymentMethodKey={initialPaymentMethod.current}
            disabledPaymentMethodKeys={disabledPaymentMethodKeys}
          />
        </div>
        <SubTotalAndFee
          subTotal={subTotal.toFixed(2)}
          fee={fee}
          tip={tip.selected ? tip.amount : 0}
          hideTipInfo={withoutPayment}
        />
        <BtnRow total={total + fee} beforeLeave={beforeLeave} />
      </div>
      <ContactFormPopup
        ref={(el) => (contactFormRef.current = el)}
        visible={popupVisible}
        initialContact={contact}
        next={beforeLeave}
        toggleClose={() => togglePopupVisible(false)}
      />
    </>
  );
}

export default ConfirmPage;
