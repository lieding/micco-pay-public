import { useMemo } from "react";
import { formatOrderInfo } from "./helper";
import styles from "./index.module.scss";
import cls from "classnames";
import { ScanOrderResponse } from "../../typing";

export default function (props: {
  data: ScanOrderResponse
  excludeTableInfo?: boolean
  style?: object
}) {
  const { data, excludeTableInfo, ...params } = props;
  const config = useMemo(() => {
    let config: Array<{ title: string; value: string }> = [];
    if (!data) return config;
    config = formatOrderInfo(data, { excludeTableInfo });
    return config;
  }, [data]);

  return (
    <div className={styles.tableWrapper} {...params}>
      {config.map((item) => (
        <div key={item.title} className={cls(styles.row)}>
          <span className={styles.title}>{item.title}</span>
          <span className={styles.value}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
