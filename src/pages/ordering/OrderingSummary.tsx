import { OrderingSummary, ICourse } from "../../typing";
import { useDispatch } from "react-redux";
import { addOrder, reduceOrder } from "../../store/ordering";
import styles from "./index.module.scss";
import { useCallback } from "react";
import cls from "classnames";
import { formatCourseLabel } from "../../utils";

function Item(props: {
  item: OrderingSummary[keyof OrderingSummary];
  cbk: (course: ICourse, isAdd?: boolean) => {};
}) {
  const { item, cbk } = props;
  return (
    <div className={styles.item}>
      <div className={styles.leftPart}>
        <div className={styles.title}>{formatCourseLabel(item.course)}</div>
        <div className={styles.price}>{item.course.price}€</div>
      </div>
      <div className={styles.rightPart}>
        <div
          className={cls(styles.oper, "flex-center")}
          onClick={() => cbk(item.course, false)}
        >
          -
        </div>
        <div className={cls(styles.badge, "flex-center")}>{item.count}</div>
        <div
          className={cls(styles.oper, "flex-center")}
          onClick={() => cbk(item.course)}
        >
          +
        </div>
      </div>
    </div>
  );
}

function OrderSummary(props: { summary: OrderingSummary }) {
  const dispatch = useDispatch();
  const { summary } = props;
  const cbk = useCallback(
    (course: ICourse, isAdd = true) =>
      isAdd ? dispatch(addOrder(course)) : dispatch(reduceOrder(course)),
    [dispatch]
  );
  return (
    <div className={styles.summary}>
      {Object.keys(summary).map((k) => (
        <Item key={k} item={summary[k]} cbk={cbk} />
      ))}
    </div>
  );
}

export default OrderSummary;
