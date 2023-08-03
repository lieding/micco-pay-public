import cls from "classnames";
import styles from "./index.module.scss";
import { DownIcon } from "../icons";
import { useState } from "react";

function FeeExplanation(props: { fee: number; hidden?: boolean }) {
  const [isAct, setAct] = useState(false);

  if (props.hidden) return null;

  return (
    <>
      <div
        className={cls("flex-between")}
        onClick={() => setAct((act) => !act)}
      >
        <div className={styles.feeExplanationTitle}>
          <span>Paiement instantané</span>
          <div className={cls(styles.downIcon, isAct ? styles.active : null)}>
            <DownIcon width="10px" height="10px" />
          </div>
        </div>
        <div>{props.fee.toFixed(2)}€</div>
      </div>
      <div className={cls(styles.expansion, isAct ? styles.active : null)}>
        <div className={styles.inner}>
          Paiement instantané est un service payant, si vous ne voulez pas payer
          ce frais, veuillez vous rédiger vers la caisse
        </div>
      </div>
    </>
  );
}

export default function SubTotalAndFee({
  subTotal,
  tip,
  fee,
  showTipAlways = false,
  hideTipInfo,
}: {
  subTotal: string;
  tip: number;
  fee: number;
  showTipAlways?: boolean;
  hideTipInfo?: boolean;
}) {
  const showTipInfo = tip || showTipAlways;
  return (
    <div className={cls(styles.wrapper)}>
      <div className={cls("flex-between")}>
        <div>Sous-total:</div>
        <div>{subTotal}€</div>
      </div>
      {showTipInfo && (
        <div className={cls("flex-between")}>
          <div>Pourboire:</div>
          <div>{tip}€</div>
        </div>
      )}
      <FeeExplanation fee={fee} hidden={hideTipInfo} />
    </div>
  );
}
