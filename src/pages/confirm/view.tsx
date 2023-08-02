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
import LogoHeader from "../../components/logoHeader";
import cls from "classnames";
import Tipping from "./tipping";
import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { STRIPE_FEATURE_KEY, resetStripeInfo } from "../../store/stripe";
import { useScrollTop } from "../../hooks";
import SubTotalAndFee from "../../components/subTotalAndFee";
import floatingTotalBtnBarStyles from "../../components/floatingTotalBtnBar/index.module.scss";
import floatingBtnBarStyles from "../../components/floatingBar/floatingBar.module.scss";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";

function BtnRow(props: { total: number; beforeLeave?: () => void }) {
  const ceilNum = Math.ceil(props.total);
  const showRounded = props.total !== ceilNum;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cbk = useCallback(
    (round?: boolean) => {
      props.beforeLeave?.();
      if (round) dispatch(setRounded(true));
      setTimeout(() => navigate("/payment"), 50);
    },
    [dispatch, navigate]
  );

  const eles = showRounded ? (
    <>
      <div className={styles.left} onClick={() => cbk(true)}>
        Arrondir à {ceilNum}€?
      </div>
      <div
        className={cls(floatingBtnBarStyles.container, styles.right)}
        onClick={() => cbk()}
      >
        Payer
      </div>
    </>
  ) : (
    <div
      className={cls(floatingBtnBarStyles.container, styles.right)}
      onClick={() => cbk()}
    >
      Payer
    </div>
  );

  return (
    <div
      className={cls(
        floatingBtnBarStyles.wrapper,
        floatingTotalBtnBarStyles.wrapper,
        styles.btnWrapper
      )}
    >
      <div className={floatingTotalBtnBarStyles.totalAmount}>
        <div>Total:</div>
        <div>{props.total.toFixed(2)}€</div>
      </div>
      <div className={styles.btnRow}>{eles}</div>
    </div>
  );
}

function ConfirmPage() {
  const {
    orderInfo: { summary, tip, rounded },
    stripeInited,
    feeConfig,
  } = useSelector((state: RootState) => ({
    orderInfo: state[ORDERING_FEATURE_KEY],
    stripeInited: state[STRIPE_FEATURE_KEY].initialized,
    feeConfig: state[RESTAURANT_FEATURE_KEY].feeConfig,
  }));

  useScrollTop();

  const dispatch = useDispatch();
  const prevTotalRef = useRef<number | null>(null);
  const total = getTotalAmount(summary, tip);
  const subTotal = getTotalAmount(summary);
  useEffect(() => {
    if (!stripeInited) return;
    prevTotalRef.current = getTotalAmount(summary, tip, rounded);
  }, []);
  // the callback function is going to be executed when it is going to leave
  // the objective is that when the user has started payment process but stopped and went back
  // in such screnrio, we need to reset the stripe data and make the paylebt start from scratch
  const beforeLeave = () => {
    if (prevTotalRef.current === null) return;
    if (total !== prevTotalRef.current) dispatch(resetStripeInfo());
  };

  // We need to re-calculate the fee every time the total price changes
  const fee = feeConfig ? (total * feeConfig.percentage + feeConfig.addition) : 0;

  return (
    <div className={cls('flex-column', 'page-wrapper', styles.pageWrapper)}>
      <LogoHeader />
      <div className={styles.content}>
        <Expasion summary={summary} />
        <div className={cls(styles.promoTitle, styles.title)}>
          Vous avez un code promo?
        </div>
        <CustomInput placeholder="Promo code" />
        <div className={cls(styles.tipTitle, styles.title)}>
          😀Vous êtes content? Laissez un pourboire
        </div>
        <Tipping tip={tip} />
      </div>
      <SubTotalAndFee
        subTotal={subTotal.toFixed(2)}
        fee={fee}
        tip={tip.selected ? tip.amount : 0}
      />
      <BtnRow total={total + fee} beforeLeave={beforeLeave} />
    </div>
  );
}

export default ConfirmPage;
