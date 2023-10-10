import styles from "./index.module.scss";
import { useMemo } from "react";
import { DateTimeUtils } from "../../utils";
import cls from 'classnames'
import { IClient, IRestaurant } from "../../typing";

function TableAndDateInfo ({ restInfo, table, clientInfo }: {
  restInfo: IRestaurant | null;
  table?: string;
  clientInfo?: IClient | null
}) {
  const dateAndPeriodStr = useMemo(DateTimeUtils.getDateAndPeriodInfo, []);

  const rightCon = clientInfo ?
    <>
      <div>{ clientInfo.title || '' }</div>
      <img src={clientInfo.imgUrl} alt="" />
    </> : 
    <>
      <div>{ dateAndPeriodStr }</div>
      { table ? <div className={styles.tableInfo}>Table { table }</div> : null }
    </>

  return <div className={cls('flex-between', styles.tableAndDateInfo)}>
    <img src={restInfo?.logoUrl} className={styles.logo} alt="logo" />
    <div className={styles.dateAndTableInfo}>
      { rightCon }
    </div>
  </div>
}

export default TableAndDateInfo;
