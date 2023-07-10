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
} from "../../typing";
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
  paymentId: string;
  restaurantId: string;
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
      <LazyQrLibrary id={config.paymentId} restaurantId={config.restaurantId} />
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
    const paymentResult = searchParams.get(
      "redirect_status"
    ) as PaymentResultEnum;
    setPaymentStatus(parsePaymentStatus(paymentResult));
    const state = LocalStorageUtils.resumeGlobalStore({
      clear: true,
    }) as RootState;
    if (!state) return;
    const paymentId = searchParams.get("payment_intent_client_secret") || "";
    const { table, restaurantId } = state[RESTAURANT_FEATURE_KEY];
    const { summary, tip, rounded } = state[ORDERING_FEATURE_KEY];
    const totalWithoutTip = getTotalAmount(summary);
    const total = getTotalAmount(summary, tip, rounded);
    const showTipInfo = Boolean(tip.selected && tip.amount);
    const body = createOrderPostBody(total, state, searchParams);
    setLoadig(true);
    createOrder(body)
      .then(() => {
        setConfig({
          table,
          total,
          showTipInfo,
          totalWithoutTip,
          paymentId,
          restaurantId,
        });
      })
      .catch(console.error)
      .finally(() => setLoadig(false));
  }, []);

  let content = null;
  if (config) {
    const { table, showTipInfo, total, totalWithoutTip } = config;
    content = (
      <>
        <div className={cls(styles.tableInfo, "textAlign")}>Table {table}</div>
        {showTipInfo && (
          <>
            <Item title="Total" value={`${totalWithoutTip}€`} />
            <Item title="Pourboire" value={`${total - totalWithoutTip}€`} />
          </>
        )}
        <Item title="Total paiement" value={`${total}€`} />
      </>
    );
  }

  return (
    <div className="page-wrapper">
      <LogoHeader hideBackArrow={true} />
      <PaymentStatus paymentStatus={paymentStatus} />
      {content}
      {isLoading && <Loading />}
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