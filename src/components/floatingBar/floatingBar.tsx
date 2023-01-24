import styles from "./floatingBar.module.scss";
import { useSelector } from "react-redux";
import { ORDERING_FEATURE_KEY, getTotalCount } from "../../store/ordering";
import { RootState } from "../../store";
import cls from "classnames";

function FloatingBar() {
  const totalCount = useSelector((state: RootState) =>
    getTotalCount(state[ORDERING_FEATURE_KEY].summary)
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={cls(styles.inner, "flex-center")}>{totalCount}</div>
        <div className={styles.centerTitle}>Commande</div>
      </div>
    </div>
  );
}

export default FloatingBar;
