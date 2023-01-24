import styles from "./index.module.scss";
import { useMemo } from "react";
import { DateTimeUtils, formatTabledisplay } from "../../utils";

function TimeAndTableInfo(props: { table: string }) {
  const dateTimeStr = useMemo(() => {
    const date = new Date();
    const monthStr = DateTimeUtils.formateMonth(date.getMonth()),
      yearStr = date.getFullYear(),
      weekdayStr = DateTimeUtils.formatWeekDay(date.getDay()),
      period = DateTimeUtils.formatTime(date);
    return `${date.getDate()} ${monthStr} ${yearStr}, ${weekdayStr} ${period}`;
  }, []);
  return (
    <div className={styles.timeAndtableInfo}>
      <div>{dateTimeStr}</div>
      <div>Table {formatTabledisplay(props.table)}</div>
    </div>
  );
}

export default TimeAndTableInfo;
