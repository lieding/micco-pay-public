import styles from "./index.module.scss";
import { useDispatch } from "react-redux";
import { setPaymentMethod } from "../../store/ordering";
import { PaymentOptionEnum } from "../../typing";
import { useCallback, useState } from "react";
import cls from "classnames";

type PaymentOptionItemType = (typeof PaymentOptions)[number];

function PaymentOptionItem({
  item,
  activeKey,
  setPaymentKey,
  disabled,
}: {
  item: PaymentOptionItemType;
  activeKey: PaymentOptionEnum;
  setPaymentKey: (key: PaymentOptionEnum) => void;
  disabled: boolean;
}) {
  const isSelected = activeKey === item.key;
  const onClick = () => setPaymentKey(item.key);
  return (
    <div className={cls(styles.item, disabled ? styles.disabled : null)}>
      <div className={styles.title}>{item.title}</div>
      {item.icon && <img className={styles.img} src={item.icon} />}
      <div
        className={cls(
          styles.circle,
          "flex-center",
          isSelected ? styles.selected : null
        )}
        onClick={onClick}
      ></div>
    </div>
  );
}

export default function PaymentMethodSelect({
  disabledPaymentMethods = [PaymentOptionEnum.RESTAURANT_TICKET],
}: {
  disabledPaymentMethods?: PaymentOptionEnum[];
}) {
  const [selectedPaymentKey, setPaymentMethodKey] = useState(
    PaymentOptionEnum.BLUE_CARD
  );
  const dispatch = useDispatch();

  const setPaymentKey = useCallback(
    (methodKey: PaymentOptionEnum) => {
      setPaymentMethodKey(methodKey);
      dispatch(setPaymentMethod(methodKey));
    },
    [dispatch, setPaymentMethodKey]
  );

  return (
    <>
      <div className={cls(styles.title)}>Méthode de Paiement</div>
      <div className={styles.paymentSelectionWrapper}>
        {PaymentOptions.map((item) => (
          <PaymentOptionItem
            key={item.key}
            item={item}
            activeKey={selectedPaymentKey}
            setPaymentKey={setPaymentKey}
            disabled={disabledPaymentMethods.includes(item.key)}
          />
        ))}
      </div>
    </>
  );
}

const PaymentOptions = [
  {
    key: PaymentOptionEnum.BLUE_CARD,
    title: "Carte Bleue",
    icon: "bluecard.jpg",
  },
  {
    key: PaymentOptionEnum.DIGITAL_WALLET,
    title: "Portefeuille numérique",
    icon: "digitalWallet.jpg",
  },
  {
    key: PaymentOptionEnum.RESTAURANT_TICKET,
    title: "Ticket restaurant",
    icon: "restaurantTicket.jpg",
  },
  {
    key: PaymentOptionEnum.IN_CASH,
    title: "Payer à la caisse",
  },
];
