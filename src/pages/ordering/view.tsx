import { useSelector } from "react-redux";
import { RootState } from "../../store";
import TimeAndTableInfo from "../../components/DatetimeTableBar";
import OrderSummary from "./OrderingSummary";
import FastBtnBar from "../../components/fastBtnBar";
import styles from "./index.module.scss";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";
import {
  ORDERING_FEATURE_KEY,
} from "../../store/ordering";
import LogoHeader from "../../components/logoHeader";
import { ICourse } from "../../typing";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import FloatingBar from "../../components/floatingBar";
import { useScrollTop } from "../../hooks";
import cls from 'classnames'

function OrderingPage() {
  const navigate = useNavigate();
  useScrollTop();
  const {
    orderInfo: { summary },
    restInfo: { table },
  } = useSelector((state: RootState) => ({
    restInfo: state[RESTAURANT_FEATURE_KEY],
    orderInfo: state[ORDERING_FEATURE_KEY],
  }));

  // const total = getTotalAmount(summary);
  // const totalCount = getTotalCount(summary);
  const toNext = useCallback(() => navigate("/confirm"), [navigate]);

  return (
    <div className="page-wrapper">
      <LogoHeader />
      <div className={cls('expanded1', styles.contentWrapper)}>
        <TimeAndTableInfo table={table} />
        <OrderSummary summary={summary} />
        <div className={styles.titlePackaging}>A emporter en plus?</div>
        <FastBtnBar isCheckout={false} elements={PackagingOptions} />
      </div>
      {/* <FloatingTotalBtnBar total={total} count={totalCount} cbk={toNext} /> */}
      <FloatingBar cbk={toNext} />
    </div>
  );
}

export default OrderingPage;

const PackagingOptions: Array<ICourse> = [
  {
    label: "Petite barquette",
    key: "barquette-1",
    price: 7,
    category: "",
    restaurantId: "",
    isPack: true,
  },
  {
    label: "Moyenne barquette",
    key: "barquette-2",
    price: 9,
    category: "",
    restaurantId: "",
    isPack: true,
  },
  {
    label: "Grande barquette",
    key: "barquette-3",
    price: 12,
    category: "",
    isPack: true,
    restaurantId: "",
  },
];
