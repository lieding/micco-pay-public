import type { ICourse, OrderingSummary } from "../../typing";
import styles from "./index.module.scss";
import { getBadgeChar } from "../../utils";
import cls from "classnames";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { addOrder, reduceOrder } from "../../store/ordering";
import { MinusIcon } from "../../components/icons";

function CourseItem(props: {
  item: ICourse;
  badgeChar: string;
  cbk: (item: ICourse, isAdd?: boolean) => {};
}) {
  const { item, badgeChar, cbk } = props;
  const showReduceIcon = badgeChar !== "+";
  const hasSubOrVolInfo = item.subtitle || item.volume;
  return (
    <div className={styles.item} onClick={() => cbk(item)}>
      <img src={item.pics?.[0]} className={styles.img} />
      <div className={styles.title}>{item.label}</div>
      {hasSubOrVolInfo && (
        <div className={cls("flex-between", styles.subAndVolInfo)}>
          <span className={styles.subtitle}>{item.subtitle || ""}</span>
          <span>{item.volume || ""}</span>
        </div>
      )}
      <div className={styles.price}>{item.price}€</div>
      <div className={cls(styles.badge, "flex-center")}>{badgeChar}</div>
      {showReduceIcon ? (
        <div
          className={cls(styles.badge, styles.reduce, "flex-center")}
          onClick={(ev) => {
            ev.stopPropagation();
            cbk(item, false);
          }}
        >
          <MinusIcon />
        </div>
      ) : null}
    </div>
  );
}

export default function CourseMenu(props: {
  items: ICourse[] | null | undefined;
  summary: OrderingSummary;
}) {
  const { items, summary } = props;

  const dispatch = useDispatch();
  const cbk = useCallback(
    (item: ICourse, isAdd = true) =>
      dispatch(isAdd ? addOrder(item) : reduceOrder(item)),
    [dispatch]
  );

  if (!items) return null;

  return (
    <div className={styles.menu}>
      {items.map((e) => (
        <CourseItem
          key={e.key}
          item={e}
          badgeChar={getBadgeChar(summary, e.key)}
          cbk={cbk}
        />
      ))}
    </div>
  );
}
