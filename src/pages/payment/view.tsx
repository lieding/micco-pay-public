import { useDispatch, useSelector } from "react-redux";
import {
  ORDERING_FEATURE_KEY,
  getTotalAmount,
  setFee,
  checkNeedContactInfo,
} from "../../store/ordering";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";
import {
  PAYGREEN_FEATURE_KEY,
  resetPaygreenInfo,
  setPaygreenInfo,
  setPaygreenInitStatus,
  setPaymentFlowStatus,
} from "../../store/paygreen";
import { RootState, persistStore } from "../../store";
import { useCallback, useEffect, useState } from "react";
import PaygreenCustomElement, {
  checkPaymentFormInteractive,
  checkShowPaymentForm,
} from "./paygreenCustomElement";
import { LogoHeader, ExpasionOrder, Loading } from "../../components";
import { queryPgOrderInfo } from "./api";
import {
  Paygreen,
  getRemainingTimeInSeconds,
  intFormatingInto2Digits,
} from "../../utils";
import cls from "classnames";
import styles from "./index.module.scss";
import {
  PaymentOptionEnum,
  PaymentResultEnum,
  PgPaymentFlowStatus,
  RequestStatusEnum,
  filterRestaurantTicketPaymentMethods,
} from "../../typing";
import { useNavigate } from "react-router-dom";
import { useScrollTop } from "../../hooks";
import PaymentFailurePopup, { ApplePayFailedWaiting4BtnPopup } from './paymentFailurePopup'

function selector(state: RootState) {
  const {
    summary,
    fee,
    amtAfterFee,
    tip,
    rounded,
    contact,
    pgPaymentMethod,
    paymentMethodKey,
    paymentConfigs,
  } = state[ORDERING_FEATURE_KEY];
  const { restaurantId } = state[RESTAURANT_FEATURE_KEY];
  let platforms = undefined;
  if (paymentMethodKey === PaymentOptionEnum.RESTAURANT_TICKET) {
    platforms = paymentConfigs
      .map(item => item.platform)
      .filter(filterRestaurantTicketPaymentMethods);
  }
  return {
    restaurantId,
    total: getTotalAmount(summary, tip),
    rounded,
    amtAfterFee,
    summary,
    fee,
    paygreenInfo: state[PAYGREEN_FEATURE_KEY],
    tip: tip.selected ? tip.amount : 0,
    subTotal: getTotalAmount(summary),
    contact,
    pgPaymentMethod,
    platforms,
  };
}

function BottomPart({
  total,
  expiresAt,
  flowStatus,
}: {
  total: number;
  expiresAt: number;
  flowStatus: PgPaymentFlowStatus;
}) {
  const [remainingTimeStr, setReaminingTimeStr] = useState("");
  useEffect(() => {
    const id = setInterval(() => {
      const { min, sec } = getRemainingTimeInSeconds(expiresAt);
      if (min <= 0 && sec <= 0) clearInterval(id);
      setReaminingTimeStr(
        `${intFormatingInto2Digits(min)}:${intFormatingInto2Digits(sec)}`
      );
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt, setReaminingTimeStr]);

  const handlePay = () => {
    window.paygreenjs?.submitPayment();
  };

  const btnDisabled = !checkPaymentFormInteractive(flowStatus);
  const visible = checkShowPaymentForm(flowStatus);

  if (!visible) return null;

  return (
    <div className={styles.bottomPart}>
      <div className={cls("flex-between")}>
        <span>Total:</span>
        <span>{total}€</span>
      </div>
      <div className={cls("textAlign")}>
        <span className={styles.timeRemaining}>{remainingTimeStr}</span>
      </div>
      <div
        id="payButton"
        className={cls("full-width-btn", btnDisabled ? "disabled" : "", styles.payButton)}
        onClick={handlePay}
      >
        {
          btnDisabled ? <span className="animation-loader" /> : 'Payer'
        }
      </div>
    </div>
  );
}

function PaymentPage() {
  const {
    summary,
    reqStatus,
    paymentFlowStatus,
    amtAfterFee,
    expiresAt,
    failPopupMsg,
    setFailPopupMsg,
    applePatFailPopupVis,
    reset4ApplePay
  } = usePaymentPageHook();

  return (
    <div className={cls("page-wrapper", "flex-column", styles.pageWrapper)}>
      <LogoHeader />
      <ExpasionOrder summary={summary} />
      {reqStatus !== RequestStatusEnum.RESOLVED ? <Loading /> : null}
      <PaygreenCustomElement flowStatus={paymentFlowStatus} />
      <BottomPart
        flowStatus={paymentFlowStatus}
        total={amtAfterFee}
        expiresAt={expiresAt}
      />
      <PaymentFailurePopup
        visible={!!failPopupMsg}
        message={failPopupMsg}
        toggleClose={() => setFailPopupMsg('')}
      />
      <ApplePayFailedWaiting4BtnPopup visible={applePatFailPopupVis} reset={reset4ApplePay}  />
    </div>
  );
}

export default PaymentPage;

function usePaymentPageHook () {
  const {
    restaurantId,
    total,
    paygreenInfo,
    summary,
    amtAfterFee,
    rounded,
    contact,
    pgPaymentMethod,
    platforms
  } = useSelector(selector);
  const {
    paymentOrderID,
    publicKey,
    objectSecret,
    expiresAt,
    initialized,
    paymentFlowStatus,
  } = paygreenInfo;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useScrollTop();

  const [reqStatus, setReqStatus] = useState(() =>
    initialized ? RequestStatusEnum.RESOLVED : RequestStatusEnum.INIT
  );
  const reset = useCallback(() => {
    dispatch(resetPaygreenInfo());
    setTimeout(() => setReqStatus(RequestStatusEnum.INIT), 500);
  }, []);
  const [ failPopupMsg, setFailPopupMsg ] = useState('');
  const [ applePatFailPopupVis, setApplePayFailVis ] = useState(false);
  const reset4ApplePay = () => {
    setApplePayFailVis(false);
    reset();
  };

  useEffect(() => {
    if (reqStatus !== RequestStatusEnum.INIT) return;
    setReqStatus(RequestStatusEnum.LOADING);
    queryPgOrderInfo(restaurantId, total, rounded, contact, platforms)
      .then((data) => {
        dispatch(setFee(data));
        dispatch(setPaygreenInfo(data));
        setReqStatus(RequestStatusEnum.RESOLVED);
        dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.EN_SELECTION));
      })
      .catch((err) => {
        console.error(err);
        setReqStatus(RequestStatusEnum.REJECTED);
      });
  }, [reqStatus]);

  useEffect(() => {
    const havingAllParams = paymentOrderID && publicKey && objectSecret;
    if (initialized || !havingAllParams) return;
    const onFinished = () => {
      // before the page redirecting, we need to to persisit the data
      persistStore();
      navigate(`/result?redirect_status=${PaymentResultEnum.SUCCEEDED}`);
    };
    const onFormFilling = () => {
      dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.FORM_FILLING));
    };
    const onError = (err?: { message: string, reset?: boolean }) => {
      if (!err) return;
      const { message, reset: isReset } = err;
      setFailPopupMsg(message || 'Echec paiment');
      // if 'reset' parameter is set ti True, it means we need to to re-initilize the paygreenjs,
      // the wholepayment flox begins from the scratch
      if (isReset) {
        reset();
      }
    }
    const onSubmit = () =>
      dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.SUBMITING));
    const onSelection = () =>
      dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.EN_SELECTION));
    const init = () => {
      try {
        dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.INIT));
        Paygreen.init(
          paymentOrderID,
          objectSecret,
          publicKey,
          pgPaymentMethod,
          { onFinished, onFormFilling, onError, onSelection, onSubmit, setApplePayFailVis }
        );
        // dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.EN_SELECTION));
        dispatch(setPaygreenInitStatus(true));
      } catch (err) {
        console.error("fail to initialize the paygreenjs", err);
        dispatch(setPaygreenInitStatus(false));
      }
    };
    setTimeout(init, 1000);
  }, [paymentOrderID, publicKey, objectSecret, initialized, pgPaymentMethod]);

  return {
    failPopupMsg,
    summary,
    reqStatus,
    setFailPopupMsg,
    paymentFlowStatus,
    expiresAt,
    amtAfterFee,
    applePatFailPopupVis,
    reset4ApplePay
  }
}
