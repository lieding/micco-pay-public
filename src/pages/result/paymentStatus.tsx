import { PaymentStatus as PaymentStatusEnum } from "../../typing";
import cls from "classnames";
import styles from "./index.module.scss";
import { SuccessIcon, ClockIcon, FailIcon } from "../../components/icons";

function getConfig(paymentStatus: PaymentStatusEnum) {
  let Icon = ClockIcon,
    subTitle = "Status inconnue";
  switch (paymentStatus) {
    case PaymentStatusEnum.SUCCEEDED:
      (Icon = SuccessIcon), (subTitle = "Paiement réussie");
      break;
    case PaymentStatusEnum.FAILED:
      (Icon = FailIcon), (subTitle = "Paiement échoué");
      break;
    case PaymentStatusEnum.PROCESSING:
      subTitle = "Paiement en cours";
      break;
    case PaymentStatusEnum.IN_OPERATION:
      subTitle = "Paiement en cours, l'operation attendue";
      break;
    default:
  }
  return { Icon, subTitle };
}

export default function PaymentStatus(props: {
  paymentStatus: PaymentStatusEnum | null;
}) {
  const { paymentStatus } = props;
  if (!paymentStatus) return null;
  const { Icon, subTitle } = getConfig(paymentStatus);
  return (
    <>
      <div className={cls(styles.iconWrapper, "textAlign")}>
        <Icon />
      </div>
      {paymentStatus === PaymentStatusEnum.SUCCEEDED ? (
        <div className={cls(styles.congra, "textAlign")}>
          Congratulations 🎉
        </div>
      ) : null}
      <div className={cls(styles.subTitle, "textAlign")}>{subTitle}</div>
    </>
  );
}