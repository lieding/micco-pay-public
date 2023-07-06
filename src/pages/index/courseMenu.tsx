import type { ICourse, OrderingSummary } from "../../typing";
import styles from "./index.module.scss";
import { getBadgeChar } from "../../utils";
import cls from "classnames";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { addOrder } from "../../store/ordering";

function CourseItem(props: {
  item: ICourse;
  badgeChar: string;
  cbk: (item: ICourse) => {};
}) {
  const { item, badgeChar, cbk } = props;
  return (
    <div className={styles.item} onClick={() => cbk(item)}>
      <img src={item.pics?.[0]} className={styles.img} />
      <div className={styles.title}>{item.label}</div>
      <div className={styles.price}>{item.price}€</div>
      <div className={cls(styles.badge, "flex-center")}>{badgeChar}</div>
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
    (item: ICourse) => dispatch(addOrder(item)),
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
