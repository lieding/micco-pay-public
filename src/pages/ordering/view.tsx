import { useSelector } from "react-redux";
import { RootState } from "../../store";
import TimeAndTableInfo from "../../components/DatetimeTableBar";
import OrderSummary from "./OrderingSummary";
import FastBtnBar from "../../components/fastBtnBar";
import styles from "./index.module.scss";
import { RESTAURANT_FEATURE_KEY } from "../../store/restaurant";
import {
  ORDERING_FEATURE_KEY,
  getTotalAmount,
  getTotalCount,
} from "../../store/ordering";
import CustomizedBtnStyles from "../../components/floatingBar/floatingBar.module.scss";
import { ICourse } from "../../typing";
import cls from "classnames";

function OrderingPage() {
  const {
    orderInfo: { summary },
    restInfo: { table },
  } = useSelector((state: RootState) => ({
    restInfo: state[RESTAURANT_FEATURE_KEY],
    orderInfo: state[ORDERING_FEATURE_KEY],
  }));

  const total = getTotalAmount(summary);
  const totalCount = getTotalCount(summary);

  return (
    <div className="page-wrapper">
      <div className="logo-wrapper textAlign">
        <img src="micco-pay-logo.png" />
      </div>
      <TimeAndTableInfo table={table} />
      <OrderSummary summary={summary} />
      <div className={styles.titlePackaging}>A emporter en plus?</div>
      <FastBtnBar isCheckout={false} elements={PackagingOptions} />
      <div className={styles.totalAmount}>
        <span>Total:</span>
        <span>{total}€</span>
      </div>
      <div className={cls(CustomizedBtnStyles.wrapper, styles.btnWrapper)}>
        <div className={CustomizedBtnStyles.container}>
          <div className={cls(CustomizedBtnStyles.inner, "flex-center")}>
            {totalCount}
          </div>
          <div className={CustomizedBtnStyles.centerTitle}>Valider</div>
        </div>
      </div>
    </div>
  );
}

export default OrderingPage;

const PackagingOptions: Array<ICourse> = [
  {
    label: "Petite barquette",
    key: "barquette-1",
    price: 6,
    category: "",
    restaurantId: "",
  },
  {
    label: "Moyenne barquette",
    key: "barquette-2",
    price: 9,
    category: "",
    restaurantId: "",
  },
  {
    label: "Grande barquette",
    key: "barquette-3",
    price: 12,
    category: "",
    restaurantId: "",
  },
];
