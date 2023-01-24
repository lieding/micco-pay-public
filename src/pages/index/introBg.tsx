import { IRestaurant } from "../../typing";
import styles from "./index.module.scss";

function IntroBg(props: { restInfo: IRestaurant }) {
  const { restInfo } = props;
  return (
    <div
      style={{ backgroundImage: `url(${restInfo.introImgUrl})` }}
      className={[styles.introBg, "default-br"].join(" ")}
    >
      <img src={restInfo.logoUrl} className={styles.logo} />
      <div className={styles.info}>
        <span className={styles.title}>{restInfo.displayName}</span>
        <span className={styles.address}>{restInfo.address}</span>
      </div>
    </div>
  );
}

export default IntroBg;
