import { useSearchParams } from "react-router-dom";
import LogoHeader from "../../components/logoHeader";
import PaymentStatus from "./paymentStatus";
import styles from "./index.module.scss";
import { RootState } from "../../store";
import { ORDERING_FEATURE_KEY, getTotalAmount } from "../../store/ordering";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";
import cls from "classnames";
import { useEffect, useState, lazy, Suspense } from "react";
import { LocalStorageUtils } from "../../utils";
import {
  createOrder,
  createOrderPostBody,
  parsePaymentStatus,
} from "./orderHelper";
import Loading from "../../components/loading";
import {
  PaymentResultEnum,
  PaymentStatus as PaymentStatusEnum,
  PaymentOptionEnum,
  ScanOrderResponse,
} from "../../typing";
import Table from "../getOrderByScan/table";
const LazyQrLibrary = lazy(() => import("./qrcode"));

/**
 * payment_intent=pi_3NRDugFZJYX0E01T05m4YKRp
 * payment_intent_client_secret=pi_3NRDugFZJYX0E01T05m4YKRp_secret_GLmzV8Ugqwfpe0ZnSSQsXRx9Q
 * redirect_status=succeeded
 */

type Config = {
  table: string;
  total: number;
  showTipInfo: boolean;
  totalWithoutTip: number;
  id: string;
  restaurantId: string;
  tipInfo: RootState["ordering"]["tip"];
  orders: ReturnType<typeof createOrderPostBody>["orders"];
};

function Qrcode(props: {
  config: Config | null;
  isLoading: boolean;
  paymentStatus: PaymentStatusEnum | null;
}) {
  const { config, isLoading, paymentStatus } = props;
  const [showQrcode, setShowQrcode] = useState(false);
  if (!config || isLoading || paymentStatus !== PaymentStatusEnum.SUCCEEDED)
    return null;
  if (!showQrcode)
    return (
      <div onClick={() => setShowQrcode(true)} className="textAlign">
        Montrez-moi le Qrcode comme preuve
      </div>
    );
  return (
    <Suspense>
      <LazyQrLibrary id={config.id} restaurantId={config.restaurantId} />
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
    const { summary, tip, rounded } = state[ORDERING_FEATURE_KEY];
    const totalWithoutTip = getTotalAmount(summary);
    const total = getTotalAmount(summary, tip, rounded);
    const showTipInfo = Boolean(tip.selected && tip.amount);
    const body = createOrderPostBody(paymentResult, total, state);

    setLoadig(true);
    createOrder(body)
      .then(() => {
        setConfig({
          id: body.id,
          table,
          total,
          showTipInfo,
          totalWithoutTip,
          restaurantId,
          tipInfo: tip,
          orders: body.orders,
        });
      })
      .catch(console.error)
      .finally(() => setLoadig(false));
  }, []);

  let content = null;
  const isPaymentInCach = paymentStatus === PaymentStatusEnum.IN_CASH;
  if (config) {
    const { table, showTipInfo, total, totalWithoutTip, tipInfo } = config;
    const titleFotTotalPayment = isPaymentInCach ? 'Reste à payer' : 'Total paiement';
    content = (
      <>
        <div className={cls(styles.tableInfo, "textAlign")}>Table {table}</div>
        {showTipInfo && (
          <>
            <Item title="Total" value={`${totalWithoutTip}€`} />
            <Item title="Pourboire" value={`${tipInfo.amount}€`} />
          </>
        )}
        <Item title={titleFotTotalPayment} value={`${total}€`} />
      </>
    );
  }
  let courseTableInfo = null;
  if (config && isPaymentInCach) {
    const configg = config as unknown as ScanOrderResponse;
    courseTableInfo = <Table data={configg} excludeTableInfo={true} />;
  }

  return (
    <div className="page-wrapper">
      <LogoHeader hideBackArrow={true} />
      <PaymentStatus paymentStatus={paymentStatus} />
      {content}
      {isLoading && <Loading />}
      {courseTableInfo}
      <Qrcode
        config={config}
        isLoading={isLoading}
        paymentStatus={paymentStatus}
      />
    </div>
  );
}

function Item(props: { title: string; value: string | React.ReactElement }) {
  const { title, value } = props;
  return (
    <div className={styles.tableItem}>
      <div className={styles.title}>{title}:</div>
      <div>{value}</div>
    </div>
  );
}
