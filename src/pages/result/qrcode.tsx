import { useMemo } from "react";
import { AwesomeQRCode } from "@awesomeqr/react";
import cls from "classnames";
import styles from "./index.module.scss";

function OrderQrcode(props: { id: string; restaurantId: string }) {
  const options = useMemo(
    () => ({
      text: `${window.location.origin}/scanOrder?id=${props.id}&restaurantId=${props.restaurantId}`,
    }),
    []
  );

  return (
    <div className={cls(styles.qrCodeWrapper, "textAlign")}>
      <AwesomeQRCode options={options} />
    </div>
  );
}

export default OrderQrcode;
