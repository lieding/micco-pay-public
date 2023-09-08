import styles from "./index.module.scss";
import { useMemo } from "react";
import { DateTimeUtils, formatTabledisplay } from "../../utils";

function TimeAndTableInfo(props: { table: string }) {
  const dateTimeStr = useMemo(DateTimeUtils.getDateAndPeriodInfo, []);
  return (
    <div className={styles.timeAndtableInfo}>
      <div>{dateTimeStr}</div>
      <div>Table {formatTabledisplay(props.table)}</div>
    </div>
  );
}

export default TimeAndTableInfo;
