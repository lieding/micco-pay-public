import { useSearchParams } from "react-router-dom";
import LogoHeader from "../../components/logoHeader";
import PaymentStatus from "./paymentStatus";
import styles from "./index.module.scss";
import { RootState } from "../../store";
import { ORDERING_FEATURE_KEY, getTotalAmount } from "../../store/ordering";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";
import cls from "classnames";
import { useEffect, useState, lazy, Suspense } from "react";
import { LocalStorageUtils, isValidArray } from "../../utils";
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
    const { summary, tip, rounded, amtAfterFee } = state[ORDERING_FEATURE_KEY];
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
          amtAfterFee
        });
      })
      .catch(console.error)
      .finally(() => setLoadig(false));
  }, []);

  let content = null;
  const isPaymentInCach = paymentStatus === PaymentStatusEnum.IN_CASH;
  if (config) {
    const { showTipInfo, total, totalWithoutTip, tipInfo, id, amtAfterFee, orders } = config;
    if (isPaymentInCach) {
      const configg = { orders } as unknown as ScanOrderResponse;
      const courseTableInfo =
        <Table data={configg} excludeTableInfo={true} style={{ marginLeft: '28px' }} />;
      return <>
        {courseTableInfo}
        {showTipInfo && <Item title="Pourboire" value={`${tipInfo.amount} EUR`} />}
        <Item title="Reste à payer" value={`${total} EUR`} />
      </>
    }
    const title = <div>Commande <strong>{id}</strong></div>;
    const strs = courseInfo2StrArr(orders);
    if (showTipInfo) strs.push(`Pourboire =  EUR`);
    strs.push(...['  ', '   ', `Total = ${amtAfterFee} EUR`]);
    content = (
      <ExpasionOrder.Simple
        title={title}
        strs={strs}
      />
    );
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
      <div className={styles.qrDivider}>
        Vous allez recevoir un email 
      </div>
      <Qrcode
        config={config}
        isLoading={isLoading}
        paymentStatus={paymentStatus}
      />
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

function Item(props: { title: string; value: string | React.ReactElement }) {
  const { title, value } = props;
  return (
    <div className={styles.tableItem}>
      <span className={styles.title}>{title}:</span>
      <span>{value}</span>
    </div>
  );
}
