import { useEffect, useRef, useState } from 'react';
import { FullWidthBtn, Loading } from '../../components';
import { BottomPopup } from '../../components/core';
import { CloseIcon } from '../../components/icons';
import styles from './index.module.scss';
import cls from 'classnames';

interface IPaymentFailureBottomUp {
  visible: boolean
  message: string
  toggleClose: () => void
}

function PaymentFailurePopup ({ visible, message, toggleClose }: IPaymentFailureBottomUp) {
  return <BottomPopup
    visible={visible}
    toggleClose={toggleClose}
    customClass={styles.paymentFailurePopup}
  >
    <>
      <div className={cls('textAlign', styles.title)}>Paiement refusé</div>
      <div className={cls('textAlign', styles.failIcon)}>
        <CloseIcon style={{ color: '7842EB' }} />
      </div>
      <div className={cls('textAlign', styles.desc)}>{ message || 'Echec paiment' }</div>
      <FullWidthBtn cbk={toggleClose}>
        <span>Continue</span>
      </FullWidthBtn>
    </>
  </BottomPopup>
}

export default PaymentFailurePopup;

enum ApplePayFailedPopup {
  PENDING,
  TIMEOUT,
}

export function ApplePayFailedWaiting4BtnPopup ({ visible, reset }: {
  visible: boolean,
  reset: () => void
}) {
  const [ status, setStatus ] = useState(ApplePayFailedPopup.PENDING);
  let title = "En initialisation d'Apple Pay";

  const isPending = status === ApplePayFailedPopup.PENDING;
  const timeoutIdRef = useRef<any>(null);

  useEffect(() => {
    clearTimeout(timeoutIdRef.current);
    if (visible) {
      setStatus(ApplePayFailedPopup.PENDING);
      timeoutIdRef.current =
        setTimeout(() => setStatus(ApplePayFailedPopup.TIMEOUT), 8000)
    }
  }, [visible]);

  useEffect(() => () => clearTimeout(timeoutIdRef.current), []);

  if (status === ApplePayFailedPopup.TIMEOUT) {
    title = "Échec de l'initialisation d'Apple Pay";
  }

  return <BottomPopup
    visible={visible}
    toggleClose={() => {}}
    customClass={styles.applePayFailedPopup}
    hideCloseBtn
  >
    <>
      <div className={cls('textAlign', styles.title)}>{ title }</div>
      {
        isPending ?
        <div className={cls('textAlign', styles.loading)}>
          <Loading />
        </div> : null
      }
        <FullWidthBtn disabled={isPending} cbk={reset}>
          <span>Réessayer</span>
        </FullWidthBtn>
    </>
  </BottomPopup>
} 
