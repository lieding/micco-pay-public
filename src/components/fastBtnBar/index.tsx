import { ICourse } from "../../typing";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ORDERING_FEATURE_KEY, addOrder } from "../../store/ordering";
import { getBadgeChar } from "../../utils";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import cls from "classnames";

function ElementInIndex(props: {
  item: ICourse;
  badgeChar: string;
  cbk: (item: ICourse) => {};
  isCheckout: boolean;
}) {
  const { item, badgeChar, cbk, isCheckout } = props;

  let elements: JSX.Element[] = [];
  if (isCheckout) {
    elements = [
      <div className={styles.firstLine}>{item.price}€</div>,
      <div className={styles.secondLine}>{item.label}</div>,
    ];
  } else {
    elements = [
      <div className={styles.title}>{item.label}</div>,
      <div className={styles.price}>{item.price}€</div>,
      <img src="barquette.png" className={styles.barquette} />,
    ];
  }

  return (
    <div
      key={item.key}
      className={
        isCheckout ? styles.itemInIndexPage : styles.itemInOrderingPage
      }
      onClick={() => cbk(item)}
    >
      {elements}
      <span className={cls(styles.badge, "flex-center")}>{badgeChar}</span>
    </div>
  );
}

function FastBtnBar(props: { isCheckout: boolean; elements: Array<ICourse> }) {
  const { isCheckout, elements } = props;
  const dispatch = useDispatch();
  const summary = useSelector(
    (state: RootState) => state[ORDERING_FEATURE_KEY].summary
  );

  const cbk = useCallback(
    (item: ICourse) => dispatch(addOrder(item)),
    [dispatch]
  );

  return (
    <div className={styles.wrapper}>
      {elements.map((e) => (
        <ElementInIndex
          item={e}
          cbk={cbk}
          badgeChar={getBadgeChar(summary, e.key)}
          isCheckout={isCheckout}
        />
      ))}
    </div>
  );
}

export default FastBtnBar;
