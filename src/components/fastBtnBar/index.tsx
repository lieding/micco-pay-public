import { ICourse } from "../../typing";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ORDERING_FEATURE_KEY, addOrder, reduceOrder } from "../../store/ordering";
import { getBadgeChar } from "../../utils";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { MinusIcon } from '../icons'
import cls from "classnames";

function Item(props: {
  item: ICourse;
  badgeChar: string;
  cbk: (item: ICourse, isAdd?: boolean) => {};
  isCheckout: boolean;
  idx: number
}) {
  const { item, badgeChar, cbk, isCheckout, idx } = props;

  let elements: (JSX.Element | null)[] = [];
  if (isCheckout) {
    const showReduceIcon = badgeChar !== '+';
    elements = [
      <div key="price" className={styles.firstLine}>
        {item.price}€
      </div>,
      <div key="label" className={styles.secondLine}>
        {item.label}
      </div>,
      showReduceIcon ? <div
        className={cls(styles.badge, styles.reduce, 'flex-center')}
        onClick={(ev) => { ev.stopPropagation(); cbk(item, false); }}
        key="reduce"
      >
        <MinusIcon />
      </div> : null
    ];
  } else {
    let style = '';
    if (idx === 0) style = 'small';
    else if (idx === 2) style = 'big';
    elements = [
      <div key="title" className={styles.title}>
        {item.label}
      </div>,
      <div key="price" className={styles.price}>
        {item.price}€
      </div>,
      <img key="img" src="barquette.png" className={cls(styles.barquette, style)} />,
    ];
  }

  return (
    <div
      className={
        isCheckout ? styles.itemInIndexPage : styles.itemInOrderingPage
      }
      key={item.key}
      onClick={() => cbk(item)}
    >
      {elements}
      <span key="badge" className={cls(styles.badge, "flex-center")}>
        {badgeChar}
      </span>
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
    (item: ICourse, isAdd = true) => dispatch(isAdd ? addOrder(item) : reduceOrder(item)),
    [dispatch]
  );

  return (
    <div className={styles.wrapper}>
      {elements.map((e, idx) => (
        <Item
          key={e.key}
          item={e}
          cbk={cbk}
          badgeChar={getBadgeChar(summary, e.key)}
          isCheckout={isCheckout}
          idx={idx}
        />
      ))}
    </div>
  );
}

export default FastBtnBar;
