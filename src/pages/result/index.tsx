import { useSearchParams } from "react-router-dom";
import LogoHeader from "../../components/logoHeader";
import PaymentStatus from "./paymentStatus";
import styles from "./index.module.scss";
import { RootState } from "../../store";
import { ORDERING_FEATURE_KEY, getTotalAmount } from "../../store/ordering";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";
import cls from "classnames";
import { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { LocalStorageUtils, isValidArray } from "../../utils";
import {
  createOrder,
  createOrderPostBody,
  parsePaymentStatus,
  addReview,
} from "./orderHelper";
import Loading from "../../components/loading";
import {
  PaymentResultEnum,
  PaymentStatus as PaymentStatusEnum,
  PaymentOptionEnum,
  IRestaurant,
  IReviewInfo,
} from "../../typing";
import Review from './review';
const LazyQrLibrary = lazy(() => import("./qrcode"));
import { ExpasionOrder } from '../../components';

type Config = {
  table: string;
  total: number;
  showTipInfo: boolean;
  totalWithoutTip: number;
  id: string;
  restaurantId: string;
  tipInfo: RootState["ordering"]["tip"];
  orders: ReturnType<typeof createOrderPostBody>["orders"];
  amtAfterFee: number;
  restInfo: RootState['restaurant']['restInfo'];
  orderNumber: string;
};

function Qrcode(props: {
  config: Config | null;
  isLoading: boolean;
  paymentStatus: PaymentStatusEnum | null;
}) {
  const { config, isLoading, paymentStatus } = props;
  if (!config || isLoading || paymentStatus !== PaymentStatusEnum.SUCCEEDED)
    return null;
  return (
    <Suspense fallback="Chargement du QR code...">
      <LazyQrLibrary
        id={config.id}
        restaurantId={config.restaurantId}
        orderNumber={config.orderNumber}
        restaurantName={config.restInfo?.displayName}
      />
    </Suspense>
  );
}

export default function ResultPage() {
  let [searchParams] = useSearchParams();
  const [config, setConfig] = useState<Config | null>(null);
  const [isLoading, setLoadig] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusEnum | null>(
    null
  );

  const postReviewInfo = useCallback((reviewInfo: IReviewInfo) => {
    if (config) {
      addReview(config.restaurantId, config.id, reviewInfo);
    }
  }, [config]);

  useEffect(() => {
    const state = LocalStorageUtils.resumeGlobalStore({
      clear: true,
    }) as RootState;
    if (!state) return;
    const isWithoutPayment =
      state.ordering.paymentMethodKey === PaymentOptionEnum.IN_CASH;
    let paymentResult = PaymentResultEnum.PROCESSING;
    if (isWithoutPayment) {
      setPaymentStatus(PaymentStatusEnum.IN_CASH);
    } else {
      paymentResult = searchParams.get(
        "redirect_status"
      ) as PaymentResultEnum;
      setPaymentStatus(parsePaymentStatus(paymentResult));
    }

    const { table, restaurantId } = state[RESTAURANT_FEATURE_KEY];
    const { summary, tip, rounded, amtAfterFee } = state[ORDERING_FEATURE_KEY];
    const totalWithoutTip = getTotalAmount(summary);
    const total = getTotalAmount(summary, tip, rounded);
    const showTipInfo = Boolean(tip.selected && tip.amount);
    const body = createOrderPostBody(paymentResult, total, state);

    setLoadig(true);
    createOrder(body)
      .then((res) => {
        const { orderNumber = 1 } = res || {};
        setConfig({
          id: body.id,
          table,
          total,
          showTipInfo,
          totalWithoutTip,
          restaurantId,
          tipInfo: tip,
          orders: body.orders,
          amtAfterFee,
          restInfo: state[RESTAURANT_FEATURE_KEY].restInfo,
          orderNumber: orderNumber.toString().padStart(3, '0')
        });
      })
      .catch(console.error)
      .finally(() => setLoadig(false));
  }, []);

  let content = null;
  const isPaymentInCach = paymentStatus === PaymentStatusEnum.IN_CASH;
  if (config) {
    const { showTipInfo, total, totalWithoutTip, tipInfo, id, amtAfterFee, orders, orderNumber } = config;
    const title = <div>Commande <strong>{orderNumber}</strong></div>;
    const strs = courseInfo2StrArr(orders);
    strs.unshift(`L'identification de l'order: ${id}`);
    if (showTipInfo) strs.push(`Pourboire =  EUR`);
    if (isPaymentInCach) {
      strs.push(...['   ',  `Reste à payer: ${total} EUR`]);
      content = (
        <>
          <div className={styles.qrDivider}></div>
          <ExpasionOrder.Simple title={title} strs={strs} />
        </>
      );
    } else {
      strs.push(...['   ',  `Total = ${amtAfterFee} EUR`]);
      content = (
        <>
          <ExpasionOrder.Simple title={title} strs={strs} />
          <div className={styles.qrDivider}>Vous allez recevoir un email</div>
        </>
      );
    }
  }

  return (
    <div className="page-wrapper">
      <LogoHeader hideBackArrow={true} />
      {
        Boolean(config?.table) &&
        <div className={cls('textAlign', styles.tableInfo)}>Table {config?.table}</div>
      }
      <PaymentStatus paymentStatus={paymentStatus} />
      {content}
      {isLoading && <Loading />}
      <Qrcode
        config={config}
        isLoading={isLoading}
        paymentStatus={paymentStatus}
      />
      <Review restInfo={config?.restInfo ?? null} postReviewInfo={postReviewInfo} />
    </div>
  );
}

function courseInfo2StrArr (orders: Config['orders']) {
  const ret = [];
  if (isValidArray(orders)) {
    for (const item of orders) {
      const count = ((item.count || 1) * item.price).toFixed(2);
      const title = `${item.count || 1} x ${item.name} = ${count} EUR`;
      ret.push(title);
    }
  }
  return ret;
}
