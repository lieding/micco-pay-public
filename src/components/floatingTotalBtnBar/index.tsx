import floatingBarStyles from "../floatingBar/floatingBar.module.scss";
import styles from "./index.module.scss";
import cls from "classnames";

interface IFloatingTotalBtnBar {
  total: number;
  cbk: (ev: any) => void;
  count: number;
}

function FloatingTotalBtnBar({ total, cbk, count }: IFloatingTotalBtnBar) {
  return (
    <div className={cls(floatingBarStyles.wrapper, styles.wrapper)}>
      <div className={styles.totalAmount}>
        <span>Total:</span>
        <span>{total}€</span>
      </div>
      <div className={cls(styles.btnWrapper)} onClick={cbk}>
        <div className={floatingBarStyles.container}>
          <div className={cls(floatingBarStyles.inner, "flex-center")}>
            {count}
          </div>
          <div className={floatingBarStyles.centerTitle}>Valider</div>
        </div>
      </div>
    </div>
  );
}

export default FloatingTotalBtnBar;
