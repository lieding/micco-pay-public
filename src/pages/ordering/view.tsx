import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { TableAndDateInfo, FastBtnBar, FloatingBar, LogoHeader } from "../../components";
import OrderSummary from "./OrderingSummary";
import styles from "./index.module.scss";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";
import {
  ORDERING_FEATURE_KEY,
} from "../../store/ordering";
import { ICourse } from "../../typing";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useScrollTop } from "../../hooks";
import cls from 'classnames'

function OrderingPage() {
  const navigate = useNavigate();
  useScrollTop();
  const {
    orderInfo: { summary },
    restInfo: { table, restInfo },
  } = useSelector((state: RootState) => ({
    restInfo: state[RESTAURANT_FEATURE_KEY],
    orderInfo: state[ORDERING_FEATURE_KEY],
  }));

  const toNext = useCallback(() => navigate("/confirm"), [navigate]);

  return (
    <div className="page-wrapper">
      <LogoHeader />
      <div className={cls('expanded1', styles.contentWrapper)}>
        <TableAndDateInfo table={table} restInfo={restInfo} />
        <OrderSummary summary={summary} />
        <div className={styles.titlePackaging}>A emporter en plus?</div>
        <FastBtnBar isCheckout={false} elements={PackagingOptions} />
      </div>
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
