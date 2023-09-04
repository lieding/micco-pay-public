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
  setPaygreenInfo,
  setPaygreenInitStatus,
  setPaymentFlowStatus,
} from "../../store/paygreen";
import { RootState, persistStore } from "../../store";
import { useEffect, useState } from "react";
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
import { IPaymentFlowStatus } from "../../global";
import { useScrollTop } from "../../hooks";

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
  const dispatch = useDispatch();

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
    dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.SUBMITING));
  };

  const btnDisabled = !checkPaymentFormInteractive(flowStatus);
  const visible = checkShowPaymentForm(flowStatus);

  if (!visible) return null;

  return (
    <>
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
        Payer
      </div>
    </>
  );
}

function PaymentPage() {
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

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const havingAllParams = paymentOrderID && publicKey && objectSecret;
    if (initialized || !havingAllParams) return;
    const onFinished = () => {
      // before the page redirecting, we need to to persisit the data
      persistStore();
      navigate(`/result?redirect_status=${PaymentResultEnum.SUCCEEDED}`);
    };
    const onFormFilling = (paymentFlow: IPaymentFlowStatus) => {
      dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.FORM_FILLING));
    };
    const onError = () =>
      dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.SUBMIT_FAILED));
    const onSelection = () =>
      dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.EN_SELECTION));
    setTimeout(() => {
      try {
        dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.INIT));
        Paygreen.init(
          paymentOrderID,
          objectSecret,
          publicKey,
          pgPaymentMethod,
          { onFinished, onFormFilling, onError, onSelection }
        );
        // dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.EN_SELECTION));
        dispatch(setPaygreenInitStatus(true));
      } catch (err) {
        console.error("fail to initialize the paygreenjs", err);
        dispatch(setPaygreenInitStatus(false));
      }
    }, 1000);
  }, [paymentOrderID, publicKey, objectSecret, initialized, pgPaymentMethod]);

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
    </div>
  );
}

export default PaymentPage;
