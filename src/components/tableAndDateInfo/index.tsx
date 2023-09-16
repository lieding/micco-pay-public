import styles from "./index.module.scss";
import { useMemo } from "react";
import { DateTimeUtils } from "../../utils";
import cls from 'classnames'
import { IRestaurant } from "../../typing";

function TableAndDateInfo ({ restInfo, table }: {
  restInfo: IRestaurant | null;
  table: string;
}) {
  const dateAndPeriodStr = useMemo(DateTimeUtils.getDateAndPeriodInfo, []);
  return <div className={cls('flex-between', styles.tableAndDateInfo)}>
    <img src={restInfo?.logoUrl} className={styles.logo} alt="logo" />
    <div className={styles.dateAndTableInfo}>
      <div>{ dateAndPeriodStr }</div>
      <div className={styles.tableInfo}>Table { table }</div>
    </div>
  </div>
}

export default TableAndDateInfo;
