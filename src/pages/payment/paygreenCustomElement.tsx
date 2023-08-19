import { useEffect, useState } from "react"
import { PgPaymentFlowStatus } from "../../typing"
import { getRemainingTimeInSeconds, intFormatingInto2Digits } from '../../utils'
import cls from 'classnames'
import { useDispatch } from "react-redux"
import { setPaymentFlowStatus } from "../../store/paygreen"

interface IProps {
  total: number
  expiresAt: number
  flowStatus: PgPaymentFlowStatus
}

function checkShowPaymentForm (flowStatus: PgPaymentFlowStatus) {
  return ![
    PgPaymentFlowStatus.INIT,
    PgPaymentFlowStatus.EN_SELECTION
  ].includes(flowStatus);
}

function checkPaymentFormInteractive (flowStatus: PgPaymentFlowStatus) {
  return flowStatus === PgPaymentFlowStatus.FORM_FILLING;
}

export default function PayGreenElement ({
  total,
  expiresAt,
  flowStatus,
}: IProps) {
  const dispatch = useDispatch();
  const [remainingTimeStr, setReaminingTimeStr] = useState('');
  useEffect(() => {
    const id = setInterval(() => {
      const { min, sec } = getRemainingTimeInSeconds(expiresAt);
      if (min <= 0 && sec <= 0) clearInterval(id);
      setReaminingTimeStr(`${intFormatingInto2Digits(min)}:${intFormatingInto2Digits(sec)}`);
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt, setReaminingTimeStr]);
  
  const handlePay = () => {
    window.paygreenjs?.submitPayment();
    dispatch(setPaymentFlowStatus(PgPaymentFlowStatus.SUBMITING));
  }

  const formVisible = checkShowPaymentForm(flowStatus);
  const formInteractive = checkPaymentFormInteractive(flowStatus);

  return <div className={cls('paygreen-wrapper')}>
    <div id="paygreen-container"></div>
    <div id="paygreen-methods-container"></div>
    {/* <h3>Payment method</h3> */}
    <div className={cls('pay-form', { visible: formVisible, interactive: formInteractive })}>
      <div>
        <label>Numéro de carte</label>
        <div id="paygreen-pan-frame" className="field-input-wrapper"></div>
      </div>
      <div className="line">
        <div>
          <label>Expiration</label>
          <div id="paygreen-exp-frame" className="field-input-wrapper"></div>
        </div>
        <div className="paygreen-cvv-container">
          <label>CVV</label>
          <div id="paygreen-cvv-frame" className="field-input-wrapper"></div>
          <i data-feather="help-circle"></i>
        </div>
      </div>
      <div id="paygreen-reuse-checkbox-container"></div>
      <button id="payButton" className="button" onClick={handlePay}>
        Payer €
        <strong>{ total.toFixed(2) }</strong>
      </button>
    </div>
    <div className={cls("icon-sentence", { visible: flowStatus !== PgPaymentFlowStatus.INIT })}>
      <i data-feather="lock"></i>
      <label className="secured-label">
        Paiement sécurisée par <strong>Paygreen</strong>
      </label>
      <span className="time-remaining">
        { remainingTimeStr }
      </span>
    </div>
  </div>
}