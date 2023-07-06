import Expasion from "../../components/expansionOrder";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  ORDERING_FEATURE_KEY,
  getTotalAmount,
  setRounded,
} from "../../store/ordering";
import styles from "./index.module.scss";
import CustomInput from "../../components/customInput";
import cls from "classnames";
import Tipping from "./tipping";
import { useCallback } from "react";

function BtnRow(props: { total: number }) {
  const ceilNum = Math.ceil(props.total);
  const showRounded = props.total !== ceilNum;

  const dispatch = useDispatch();

  const cbk = useCallback(
    (round?: boolean) => {
      if (round) dispatch(setRounded(true));
    },
    [dispatch]
  );

  const eles = showRounded ? (
    <>
      <div className={styles.left} onClick={() => cbk()}>
        Payer
      </div>
      <div className={styles.right} onClick={() => cbk(true)}>
        Arrondi à {ceilNum}€?
      </div>
    </>
  ) : (
    <div className={styles.right} onClick={() => cbk()}>
      Payer
    </div>
  );

  return <div className={styles.btnRow}>{eles}</div>;
}

function ConfirmPage() {
  const {
    orderInfo: { summary, tip },
  } = useSelector((state: RootState) => ({
    orderInfo: state[ORDERING_FEATURE_KEY],
  }));

  const total = getTotalAmount(summary, tip);

  return (
    <div className="page-wrapper">
      <div className="logo-wrapper textAlign">
        <img src="micco-pay-logo.png" />
      </div>
      <Expasion summary={summary} />
      <div className={cls(styles.promoTitle, styles.title)}>
        Vous avez un code promo?
      </div>
      <CustomInput placeholder="Promo code" />
      <div className={cls(styles.tipTitle, styles.title)}>
        😀Vous êtes content? Laissez un pourboire
      </div>
      <Tipping />
      <div className={styles.total}>
        <div>Total:</div>
        <div>{total}€</div>
      </div>
      <BtnRow total={total} />
    </div>
  );
}

export default ConfirmPage;