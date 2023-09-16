import styles from "./index.module.scss";
import { useDispatch } from "react-redux";
import { setPaymentMethod } from "../../store/ordering";
import { IPgPaymentConfig, PaymentOptionEnum, PgPaymentMethod } from "../../typing";
import { useCallback, useMemo, useState } from "react";
import cls from "classnames";
import { isValidArray } from "../../utils";

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
    <div className={cls(styles.item, disabled ? styles.disabled : null)} onClick={onClick}>
      <div className={styles.title}>{item.title}</div>
      {item.icon && <img className={styles.img} src={item.icon} />}
      <div
        className={cls(
          styles.circle,
          "flex-center",
          isSelected ? styles.selected : null
        )}
      />
    </div>
  );
}

export default function PaymentMethodSelect({
  disabledPaymentMethodKeys = [],
  configs,
  initialPaymentMethodKey,
}: {
  disabledPaymentMethodKeys?: PaymentOptionEnum[];
  configs: IPgPaymentConfig[];
  initialPaymentMethodKey: PaymentOptionEnum
}) {
  const [selectedPaymentKey, setPaymentMethodKey] = useState(
    initialPaymentMethodKey ?? PaymentOptionEnum.BLUE_CARD
  );
  const dispatch = useDispatch();

  const setPaymentKey = useCallback(
    (methodKey: PaymentOptionEnum) => {
      setPaymentMethodKey(methodKey);
      const pg = PaymentOptions
        .find(item => item.key === methodKey)?.pgPaymentMethod ?? null;
      dispatch(setPaymentMethod({ pg, methodKey }));
    },
    [dispatch, setPaymentMethodKey]
  );

  // const enabledConfigs = useMemo(() => {
  //   if (!isValidArray(configs)) return [];
  //   const enabledMap = formatPaymentOptions(configs);
  //   return PaymentOptions.filter(({ key }) => enabledMap[key]);
  // }, [configs]);

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
            disabled={disabledPaymentMethodKeys.includes(item.key)}
          />
        ))}
      </div>
    </>
  );
}

function formatPaymentOptions (configs: IPgPaymentConfig[]) {
  const map: Record<string, boolean> = {};
  for (const option of PaymentOptions) {
    map[option.key] = false;
  }
  map[PaymentOptionEnum.IN_CASH] = true;
  for (const config of configs) {
    if (config.platform === PgPaymentMethod.BANK_CARD)
      map[PaymentOptionEnum.BLUE_CARD] = true;
    else if (config.platform === PgPaymentMethod.APPLE_PAY)
      map[PaymentOptionEnum.DIGITAL_WALLET] = true;
    else if ([
      PgPaymentMethod.SWILE,
      PgPaymentMethod.CONECS,
      PgPaymentMethod.RESTOFLASH
      ].includes(config.platform)
    )
    map[PaymentOptionEnum.RESTAURANT_TICKET] = true;
  }
  return map;
}

const PaymentOptions = [
  {
    key: PaymentOptionEnum.BLUE_CARD,
    title: "Carte Bleue",
    icon: "bluecard.jpg",
    pgPaymentMethod: PgPaymentMethod.BANK_CARD,
  },
  {
    key: PaymentOptionEnum.DIGITAL_WALLET,
    title: "Portefeuille numérique",
    icon: "digitalWallet.jpg",
    pgPaymentMethod: PgPaymentMethod.APPLE_PAY,
  },
  {
    key: PaymentOptionEnum.RESTAURANT_TICKET,
    title: "Ticket restaurant",
    icon: "restaurantTicket.png",
  },
  {
    key: PaymentOptionEnum.IN_CASH,
    title: "Payer à la caisse",
  },
];
