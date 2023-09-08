import { FullWidthBtn } from '../../components';
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

export default PaymentFailurePopup