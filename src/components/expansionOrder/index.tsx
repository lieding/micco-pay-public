import { useState } from "react";
import { OrderingSummary } from "../../typing";
import styles from "./index.module.scss";
import cls from "classnames";
import { DownIcon } from "../../components/icons";
import { formatCourseLabel } from "../../utils";

function Row(props: { item: OrderingSummary[string] }) {
  const { item } = props;
  return (
    <div className={styles.row}>
      <div className={styles.label}>{formatCourseLabel(item.course)}</div>
      <div>{item.count}</div>
      <div className={styles.price}>{item.course.price}€</div>
    </div>
  );
}

function ExpasionOrder(props: { summary: OrderingSummary }) {
  const { summary } = props;

  const [isActive, setActive] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.title}
        onClick={() => setActive((status) => !status)}
      >
        <div>Vos commandes</div>
        <div>
          <DownIcon
            className={cls(styles.icon, { [styles.active]: isActive })}
          />
        </div>
      </div>
      <div className={cls(styles.expasion, { [styles.active]: isActive })}>
        {Object.keys(summary).map((k) => (
          <Row key={k} item={summary[k]} />
        ))}
      </div>
    </div>
  );
}

export default ExpasionOrder;
