import { ICourse } from "../../typing";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  ORDERING_FEATURE_KEY,
  addOrder,
  reduceOrder,
} from "../../store/ordering";
import { getBadgeChar } from "../../utils";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useRef } from "react";
import { MinusIcon } from "../icons";
import cls from "classnames";

function itemClickHandler (ev: MouseEvent, item: ICourse, cbk: Function, badgeChar: string) {
  try {
    ev.stopPropagation();
    let el = (ev.target || ev.srcElement || ev.currentTarget) as HTMLDivElement;
    if (!el) return;
    if (badgeChar === '+')
      return cbk(item, true);
    let nodeName = el.nodeName.toLowerCase();
    if (nodeName === 'path') {
      el = el.parentNode as HTMLDivElement;
      nodeName = el.nodeName.toLowerCase();
    }
    if (nodeName === 'svg') {
      el = el.parentNode as HTMLDivElement;
      nodeName = el.nodeName.toLowerCase();
    }
    if (nodeName === 'span') {
      return cbk(item, !el.className.includes('reduce'));
    }
    const { offsetX } = ev;
    if (isNaN(offsetX)) return;
    const threshold = el.getBoundingClientRect().width / 2;
    cbk(item, offsetX > threshold);
  } catch (err) { console.error(err); }
}

function Item(props: {
  item: ICourse;
  badgeChar: string;
  cbk: (item: ICourse, isAdd?: boolean) => {};
  isCheckout: boolean;
  idx: number;
}) {
  const { item, badgeChar, cbk, isCheckout, idx } = props;
  const divRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef('+');
  badgeRef.current = badgeChar;

  let elements: (JSX.Element | null)[] = [];
  if (isCheckout) {
    const showReduceIcon = badgeChar !== "+";
    elements = [
      <div key="price" className={styles.firstLine}>
        {item.price}€
      </div>,
      <div key="label" className={styles.secondLine}>
        {item.label}
      </div>,
      showReduceIcon ? (
        <span
          className={cls(styles.badge, styles.reduce, "flex-center")}
          key="reduce"
        >
          <MinusIcon />
        </span>
      ) : null,
    ];
  } else {
    let style = "";
    if (idx === 0) style = styles.smallBarquette;
    else if (idx === 2) style = styles.bigBarquette;
    elements = [
      <div key="title" className={styles.title}>
        {item.label}
      </div>,
      <div key="price" className={styles.price}>
        {item.price}€
      </div>,
      <img
        key="img"
        src="barquette.png"
        className={cls(styles.barquette, style)}
      />,
    ];
  }

  useEffect(() => {
    const el = divRef.current;
    if (!el) return;
    const listener = (ev: any) => itemClickHandler(ev, item, cbk, badgeRef.current);
    el.addEventListener('click', listener);
    return () => el.removeEventListener('click', listener);
  }, [cbk, item]);

  return (
    <div
      className={cls(
        styles.item,
        isCheckout ? styles.itemInIndexPage : styles.itemInOrderingPage
      )}
      key={item.key}
      // only when the number of selected is equal to zero
      ref={el => divRef.current = el}
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
    (item: ICourse, isAdd = true) =>
      dispatch(isAdd ? addOrder(item) : reduceOrder(item)),
    [dispatch]
  );

  const scrollWrapperStyle =
    elements.length > 3 ? styles.moreThan3 : styles.notMoreThan3;

  return (
    <div className={styles.wrapper}>
      <div className={cls(styles.scrollWrapper, scrollWrapperStyle)}>
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
    </div>
  );
}

export default FastBtnBar;
