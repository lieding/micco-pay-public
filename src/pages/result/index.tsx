import { useSearchParams } from "react-router-dom";
import LogoHeader from "../../components/logoHeader";
import { SuccessIcon } from "../../components/icons";
import styles from "./index.module.scss";
import { RootState } from "../../store";
import { ORDERING_FEATURE_KEY, getTotalAmount } from "../../store/ordering";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";
import cls from "classnames";
import { useEffect, useState } from "react";
import { LocalStorageUtils } from "../../utils";
import { createOrder, createOrderPostBody } from "./orderHelper";
import Loading from "../../components/loading";

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
};

export default function ResultPage() {
  let [searchParams] = useSearchParams();
  const [config, setConfig] = useState<Config | null>(null);
  const [isLoading, setLoadig] = useState(false);

  useEffect(() => {
    const state = LocalStorageUtils.resumeGlobalStore() as RootState;
    if (!state) return;
    const { summary, tip, rounded } = state[ORDERING_FEATURE_KEY];
    const totalWithoutTip = getTotalAmount(summary);
    const total = getTotalAmount(summary, tip, rounded);
    const showTipInfo = Boolean(tip.selected && tip.amount);
    const body = createOrderPostBody(total, state, searchParams);
    setLoadig(true);
    createOrder(body)
      .then(() => {
        setConfig({
          table: state[RESTAURANT_FEATURE_KEY].table,
          total,
          showTipInfo,
          totalWithoutTip,
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
      <div className={cls(styles.iconWrapper, "textAlign")}>
        <SuccessIcon />
      </div>
      <div className={cls(styles.congra, "textAlign")}>Congratulations 🎉</div>
      <div className={cls(styles.subTitle, "textAlign")}>Paiement réussie</div>
      {content}

      {isLoading && <Loading />}
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
