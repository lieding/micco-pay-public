import { useMemo } from "react";
import { formatOrderInfo } from "./helper";
import styles from "./index.module.scss";
import cls from "classnames";
import { ScanOrderResponse } from "../../typing";

export default function (props: { data: ScanOrderResponse }) {
  const { data } = props;
  const config = useMemo(() => {
    let config: Array<{ title: string; value: string }> = [];
    if (!data) return config;
    config = formatOrderInfo(data);
    return config;
  }, [data]);

  return (
    <div className={styles.tableWrapper}>
      {config.map((item) => (
        <div key={item.title} className={cls(styles.row, "flex-center")}>
          <div className={styles.title}>{item.title}:</div>
          <div className={styles.value}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}
