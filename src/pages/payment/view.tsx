import { useDispatch, useSelector } from "react-redux";
import { ORDERING_FEATURE_KEY, getTotalAmount, setFee } from "../../store/ordering";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";
import { PAYGREEN_FEATURE_KEY, setPaygreenInfo, setPaygreenInitStatus, setPaymentFlowStatus } from "../../store/paygreen";
import { RootState, persistStore } from "../../store";
import { useEffect, useState } from "react";
import PaygreenCustomElement from './paygreenCustomElement'
import { LogoHeader, ExpasionOrder, Loading } from '../../components'
import { queryPgOrderInfo } from './api'
import { Paygreen } from '../../utils'
import cls from "classnames";
import styles from "./index.module.scss";
import { PaymentResultEnum, PgPaymentFlowStatus, RequestStatusEnum } from "../../typing";
import { useNavigate } from "react-router-dom";
import { IPaymentFlowStatus } from "../../global";

function selector (state: RootState) {
  const { summary, fee, amtAfterFee, tip, rounded, contact, pgPaymentMethod } =
    state[ORDERING_FEATURE_KEY];
  const { restaurantId } = state[RESTAURANT_FEATURE_KEY];
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
    pgPaymentMethod
  };
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
  } = useSelector(selector);
  const {
    paymentOrderID,
    publicKey,
    objectSecret,
    expiresAt,
    initialized,
    paymentFlowStatus,
  } = paygreenInfo;

  const [ reqStatus, setReqStatus ] = useState(
    () => initialized ? RequestStatusEnum.RESOLVED : RequestStatusEnum.INIT);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setReqStatus(RequestStatusEnum.LOADING);
    queryPgOrderInfo(restaurantId, total, rounded, contact)
      .then(data => {
        dispatch(setFee(data));
        dispatch(setPaygreenInfo(data));
        setReqStatus(RequestStatusEnum.RESOLVED);
        dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.EN_SELECTION));
      })
      .catch(err => {
        console.error(err);
        setReqStatus(RequestStatusEnum.REJECTED);
      });
  }, [dispatch, setReqStatus])

  useEffect(() => {
    const havingAllParams = paymentOrderID && publicKey && objectSecret
    if (initialized || !havingAllParams) return;
    const onFinished = () => {
      // before the page redirecting, we need to to persisit the data
      persistStore();
      navigate(`/result?redirect_status=${PaymentResultEnum.SUCCEEDED}`);
    }
    const onFormFilling = (paymentFlow: IPaymentFlowStatus) => {
      dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.FORM_FILLING));
    }
    const onError =
      () => dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.SUBMIT_FAILED));
    const onSelection =
      () => dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.EN_SELECTION));
    setTimeout(() => {
      try {
        dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.INIT));
        Paygreen.init(
          paymentOrderID,
          objectSecret,
          publicKey,
          pgPaymentMethod,
          { onFinished, onFormFilling, onError, onSelection },
        );
        // dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.EN_SELECTION));
        dispatch(setPaygreenInitStatus(true));
      } catch (err) {
        console.error('fail to initialize the paygreenjs', err);
        dispatch(setPaygreenInitStatus(false));
      }
    }, 1000)
  }, [paymentOrderID, publicKey, objectSecret, initialized, pgPaymentMethod]);

  return (
    <div className={cls("page-wrapper", styles.pageWrapper)}>
      <LogoHeader />
      <ExpasionOrder summary={summary} />
      {
        reqStatus !== RequestStatusEnum.RESOLVED ? <Loading /> : null
      }
      <PaygreenCustomElement
        total={amtAfterFee}
        expiresAt={expiresAt}
        flowStatus={paymentFlowStatus}
      />
    </div>
  );
}

export default PaymentPage;
