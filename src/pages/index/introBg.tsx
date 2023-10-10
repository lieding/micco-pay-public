import { IRestaurant } from "../../typing";
import cls from 'classnames';
import { Image, Loading } from 'react-vant';
import styles from "./index.module.scss";

function IntroBg(props: { restInfo: IRestaurant | null }) {
  const introImgUrl = props?.restInfo?.introImgUrl;
  if (!introImgUrl) return null;
  return (
    <div
      className={cls(styles.introBg, "default-br")}
    >
      {/* <img src={restInfo.logoUrl} className={styles.logo} />
      <div className={styles.info}>
        <span className={styles.title}>{restInfo.displayName}</span>
        <span className={styles.address}>{restInfo.address}</span>
      </div> */}
      <Image
        loadingIcon={<Loading type='spinner' />}
        src={introImgUrl}
        fit="cover"
      />
    </div>
  );
}

export default IntroBg;
